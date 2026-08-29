"use client";

import { useState } from "react";
import type { FormField } from "@/data/forms";
import type { FormKind } from "@/lib/forms";

interface ContactFormProps {
  kind: FormKind;
  fields: FormField[];
  heading?: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
  className?: string;
}

type Status = "idle" | "sending" | "sent" | "error";

/** Fields that map onto the submission itself; everything else is `extra`. */
const CORE_FIELDS = ["name", "email", "phone", "message"];

const inputClass =
  "input-glow w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-foreground placeholder:text-muted/50 transition-all";

/**
 * The one form used across the site — referrals, general contact and
 * recruitment. Fields are data (see src/data/forms.ts); submission always
 * goes through /api/forms, which decides the inbox.
 */
export function ContactForm({
  kind,
  fields,
  heading,
  submitLabel = "Send Message",
  successTitle = "Thank You!",
  successMessage = "We've received your message and will be in touch soon.",
  className = "space-y-5",
}: ContactFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const setValue = (name: string, value: string) =>
    setValues((current) => ({ ...current, [name]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const extra = Object.fromEntries(
      Object.entries(values).filter(([name]) => !CORE_FIELDS.includes(name) && name !== "website"),
    );

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: values.name ?? "",
          email: values.email ?? "",
          phone: values.phone ?? "",
          message: values.message ?? "",
          website: values.website ?? "",
          extra,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("sent");
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-primary/10 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-primary-dark mb-2">{successTitle}</h3>
        <p className="text-muted">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate={false}>
      {heading && <h2 className="text-xl font-bold text-primary-dark mb-2">{heading}</h2>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {fields.map((field) => {
          const id = `${kind}-${field.name}`;
          return (
            <div key={field.name} className={field.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
                {field.label}
                {field.required && (
                  <span className="text-red-500" aria-hidden="true">
                    {" *"}
                  </span>
                )}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  id={id}
                  name={field.name}
                  required={field.required}
                  rows={field.rows ?? 4}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder={field.placeholder}
                />
              ) : field.type === "select" ? (
                <select
                  id={id}
                  name={field.name}
                  required={field.required}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  className={`${inputClass} bg-white`}
                >
                  <option value="">{field.placeholder ?? "Select an option…"}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  autoComplete={field.autoComplete}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setValue(field.name, event.target.value)}
                  className={inputClass}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor={`${kind}-website`}>Website</label>
        <input
          id={`${kind}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website ?? ""}
          onChange={(event) => setValue("website", event.target.value)}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-primary-dark text-white py-3.5 rounded-full font-semibold hover:bg-teal-800 transition-colors text-lg focus-ring disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
