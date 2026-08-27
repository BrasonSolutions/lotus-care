/**
 * Shared form contract used by every website form (referrals, general
 * contact, recruitment). The browser posts one of these to /api/forms and
 * the route handler decides which inbox it goes to — the recipient is never
 * sent from the client, so the form can't be turned into an open relay.
 */

export const formKinds = ["referral", "contact", "recruitment"] as const;

export type FormKind = (typeof formKinds)[number];

export interface FormSubmission {
  kind: FormKind;
  name: string;
  email: string;
  phone?: string;
  message: string;
  /** Extra per-form answers, e.g. the recruitment form's role select. */
  extra?: Record<string, string>;
}

export type ValidationResult =
  | { ok: true; data: FormSubmission }
  | { ok: false; error: string };

const LIMITS = {
  name: 100,
  email: 200,
  phone: 40,
  message: 5000,
  extra: 500,
} as const;

/** Deliberately permissive — the real check is the delivery attempt. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readExtra(value: unknown): Record<string, string> | string {
  if (value === undefined) return {};
  if (!isRecord(value)) return "Invalid additional fields.";

  const entries = Object.entries(value).map(
    ([key, raw]) => [key, asTrimmedString(raw)] as const,
  );

  if (entries.some(([, text]) => text.length > LIMITS.extra)) {
    return "One of the additional fields is too long.";
  }

  return Object.fromEntries(entries.filter(([, text]) => text.length > 0));
}

/**
 * Validates an untrusted request body. Pure — no I/O, so it is testable and
 * safe to run before anything touches the mail service.
 */
export function validateSubmission(body: unknown): ValidationResult {
  if (!isRecord(body)) return { ok: false, error: "Invalid request body." };

  // Honeypot: a hidden field real people never see, let alone fill in.
  if (asTrimmedString(body.website).length > 0) {
    return { ok: false, error: "Rejected." };
  }

  const kind = asTrimmedString(body.kind);
  if (!formKinds.includes(kind as FormKind)) {
    return { ok: false, error: "Unknown form." };
  }

  const name = asTrimmedString(body.name);
  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > LIMITS.name) return { ok: false, error: "Name is too long." };

  const email = asTrimmedString(body.email);
  if (!email) return { ok: false, error: "Please enter your email address." };
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const phone = asTrimmedString(body.phone);
  if (phone.length > LIMITS.phone) return { ok: false, error: "Phone number is too long." };

  const message = asTrimmedString(body.message);
  if (!message) return { ok: false, error: "Please enter a message." };
  if (message.length > LIMITS.message) return { ok: false, error: "Message is too long." };

  const extra = readExtra(body.extra);
  if (typeof extra === "string") return { ok: false, error: extra };

  return {
    ok: true,
    data: { kind: kind as FormKind, name, email, message, ...(phone && { phone }), extra },
  };
}
