"use client";

import { useEffect, useRef } from "react";
import { ContactForm } from "@/components/contact-form";
import { feedbackFields } from "@/data/forms";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

/** Site-wide "Have Your Say" trigger — a genuinely anonymous-capable
 * feedback form (see src/lib/forms.ts's "feedback" kind). Same native
 * `<dialog>` pattern as TeamModal (focus trap, ESC-to-close and
 * focus-return all come from the browser for free). */
export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-4 w-[90vw] max-w-lg m-auto"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="Have Your Say"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-in p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-primary-dark mb-2">Have Your Say</h2>
        <p className="text-muted text-sm mb-6">
          Share feedback, a compliment or a concern — anonymously if you prefer. Only a
          category and message are required.
        </p>
        <ContactForm
          kind="feedback"
          fields={feedbackFields}
          submitLabel="Send Feedback"
          successTitle="Thank you"
          successMessage="We've received your feedback."
          turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        />
      </div>
    </dialog>
  );
}
