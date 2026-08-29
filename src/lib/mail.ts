import type { FormSubmission } from "./forms";

/**
 * Where each form lands. Kept server-side on purpose — the browser sends a
 * form kind, never a recipient address.
 */
const RECIPIENTS: Record<FormSubmission["kind"], string> = {
  referral: "referals@lotuscare.ie",
  contact: "info@lotuscare.ie",
  recruitment: "info@lotuscare.ie",
};

const SUBJECTS: Record<FormSubmission["kind"], string> = {
  referral: "New referral enquiry",
  contact: "New website enquiry",
  recruitment: "New recruitment enquiry",
};

/**
 * The sender is always a Lotus Care address on a domain verified with
 * Resend — a visitor's own address would fail SPF/DKIM. Their address goes
 * in Reply-To instead, so replying from the inbox reaches the real person.
 */
const FROM = process.env.MAIL_FROM ?? "Lotus Care Website <noreply@lotuscare.ie>";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(submission: FormSubmission): string {
  const rows: [string, string][] = [
    ["Name", submission.name],
    ["Email", submission.email],
    ...(submission.phone ? ([["Phone", submission.phone]] as [string, string][]) : []),
    ...Object.entries(submission.extra ?? {}),
    ["Message", submission.message],
  ];

  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${escapeHtml(label)}</th>` +
        `<td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `<table style="font-family:sans-serif;font-size:14px">${cells}</table>`;
}

/**
 * Sends one form submission. Throws on any failure so the route handler can
 * surface an error — a form that silently drops a referral is worse than one
 * that says it failed.
 */
export async function sendFormEmail(submission: FormSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [RECIPIENTS[submission.kind]],
      reply_to: submission.email,
      subject: `${SUBJECTS[submission.kind]} — ${submission.name}`,
      html: buildHtml(submission),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the message (${response.status}): ${await response.text()}`);
  }
}
