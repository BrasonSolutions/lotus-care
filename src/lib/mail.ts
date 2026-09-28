import {
  contactFields,
  feedbackFields,
  recruitmentFields,
  referralFields,
  type FormField,
} from "@/data/forms";
import type { FormSubmission } from "./forms";

/**
 * Where each form lands. Kept server-side on purpose — the browser sends a
 * form kind, never a recipient address.
 */
const RECIPIENTS: Record<FormSubmission["kind"], string> = {
  referral: "referrals@lotuscare.ie",
  contact: "info@lotuscare.ie",
  recruitment: "jobs@lotuscare.ie",
  feedback: "info@lotuscare.ie",
};

const SUBJECTS: Record<FormSubmission["kind"], string> = {
  referral: "New referral enquiry",
  contact: "New website enquiry",
  recruitment: "New recruitment enquiry",
  feedback: "New \"Have Your Say\" feedback",
};

/** Used in the email's own "Received via the ___" line — distinct from
 * SUBJECTS, which reads better in a mail client's subject list. */
const FORM_LABELS: Record<FormSubmission["kind"], string> = {
  referral: "referral form",
  contact: "contact form",
  recruitment: "recruitment form",
  feedback: "Have Your Say form",
};

const INTROS: Record<FormSubmission["kind"], string> = {
  referral: "Someone has submitted a referral enquiry through lotuscare.ie. The details are below.",
  contact: "Someone has sent a message through the contact form on lotuscare.ie. The details are below.",
  recruitment: "Someone has submitted a recruitment enquiry through lotuscare.ie. The details are below.",
  feedback: "Someone has sent feedback through the Have Your Say form on lotuscare.ie. The details are below.",
};

/** Same field definitions the forms themselves render — reused here so a
 * label never has to be typed twice. */
const FIELDS_BY_KIND: Record<FormSubmission["kind"], FormField[]> = {
  referral: referralFields,
  contact: contactFields,
  recruitment: recruitmentFields,
  feedback: feedbackFields,
};

/** The one `extra` field per kind, if any, that gets the highlighted
 * category-style treatment (feedback's Category, referral's Service
 * Required, recruitment's Role Type). Contact has no such field. */
const HIGHLIGHT_FIELD: Partial<Record<FormSubmission["kind"], string>> = {
  feedback: "category",
  referral: "serviceRequired",
  recruitment: "role",
};

/**
 * The sender is always a Lotus Care address on a domain verified with
 * Resend — a visitor's own address would fail SPF/DKIM. Their address goes
 * in Reply-To instead, so replying from the inbox reaches the real person.
 */
const FROM = process.env.MAIL_FROM ?? "Lotus Care Website <noreply@lotuscare.ie>";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/**
 * Local/testing escape hatch only — e.g. before a sending domain is
 * verified with Resend, which restricts delivery to the account's own
 * signup address. Unset in production, so real routing is untouched.
 */
const RECIPIENT_OVERRIDE = process.env.MAIL_TO_OVERRIDE;

/**
 * Email clients fetch images from the recipient's side, so these must be
 * publicly hosted — inline/data-URI images are unreliable in Outlook.
 * Swap this once lotuscare.ie itself is the deployed custom domain.
 */
const ASSET_BASE_URL = process.env.MAIL_ASSET_BASE_URL ?? "https://lotus-care.brasonsolutions.com";
const LOGO_URL = `${ASSET_BASE_URL}/images/email/logo-white.png`;
const MARK_URL = `${ASSET_BASE_URL}/images/email/lotus-mark-teal.png`;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fieldLabel(kind: FormSubmission["kind"], key: string): string {
  return FIELDS_BY_KIND[kind].find((field) => field.name === key)?.label ?? key;
}

function formatSubmittedAt(date: Date): string {
  const datePart = new Intl.DateTimeFormat("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Dublin",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Dublin",
  }).format(date);
  return `${datePart} at ${timePart}`;
}

const FONT = "Arial,Helvetica,sans-serif";
const LABEL_STYLE =
  `margin:0 0 4px;font-family:${FONT};font-size:12px;font-weight:bold;` +
  "letter-spacing:1.8px;text-transform:uppercase;color:#6b7280;mso-line-height-rule:exactly;line-height:16px";
const VALUE_STYLE = `margin:0;font-family:${FONT};font-size:16px;color:#2d3436;mso-line-height-rule:exactly;line-height:24px`;

function buildHtml(submission: FormSubmission): string {
  const kind = submission.kind;
  const extra = submission.extra ?? {};
  const highlightKey = HIGHLIGHT_FIELD[kind];
  const highlightValue = highlightKey ? extra[highlightKey] : undefined;

  const preheader = `${highlightValue ? `${highlightValue} — ` : ""}${SUBJECTS[kind]} received via lotuscare.ie`;

  const highlightBox = highlightValue
    ? `<tr><td style="padding:24px 32px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#eef9fb;border-radius:16px">
<tbody><tr>
<td width="56" valign="top" style="width:56px;padding:24px 0 24px 24px">
<img src="${MARK_URL}" width="32" height="32" alt="" style="display:block;width:32px;height:32px;border:0">
</td>
<td valign="top" style="padding:24px 24px 24px 16px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:#0d6a70;mso-line-height-rule:exactly;line-height:16px">${escapeHtml(fieldLabel(kind, highlightKey!))}</p>
<p style="margin:0;font-family:${FONT};font-size:20px;font-weight:bold;color:#0d6a70;mso-line-height-rule:exactly;line-height:26px">${escapeHtml(highlightValue)}</p>
</td>
</tr>
</tbody></table>
</td></tr>`
    : "";

  const detailRows: string[] = [];
  if (submission.name) {
    detailRows.push(`<p style="${LABEL_STYLE}">Full name</p><p style="${VALUE_STYLE}">${escapeHtml(submission.name)}</p>`);
  }
  if (submission.email) {
    detailRows.push(
      `<p style="${LABEL_STYLE}">Email address</p>` +
        `<p style="margin:0;font-family:${FONT};font-size:16px;mso-line-height-rule:exactly;line-height:24px">` +
        `<a href="mailto:${escapeHtml(submission.email)}" style="color:#0d6a70;text-decoration:underline">${escapeHtml(submission.email)}</a></p>`,
    );
  }
  if (submission.phone) {
    detailRows.push(`<p style="${LABEL_STYLE}">Phone number</p><p style="${VALUE_STYLE}">${escapeHtml(submission.phone)}</p>`);
  }
  for (const [key, value] of Object.entries(extra)) {
    if (key === highlightKey || !value) continue;
    detailRows.push(`<p style="${LABEL_STYLE}">${escapeHtml(fieldLabel(kind, key))}</p><p style="${VALUE_STYLE}">${escapeHtml(value)}</p>`);
  }

  const detailsBlock = detailRows.length
    ? `<tr><td style="padding:24px 32px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%">
<tbody>${detailRows
        .map(
          (row, i) =>
            `<tr><td style="padding:${i === 0 ? "0" : "16px"} 0 ${i === detailRows.length - 1 ? "0" : "16px"};${
              i === detailRows.length - 1 ? "" : "border-bottom:1px solid #f3f4f6"
            }">${row}</td></tr>`,
        )
        .join("")}</tbody></table>
</td></tr>`
    : "";

  const cta = submission.email
    ? `<tr><td style="padding:32px 32px 0">
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
<tbody><tr>
<td bgcolor="#1badb2" style="border-radius:9999px">
<a href="mailto:${escapeHtml(submission.email)}" style="display:block;padding:16px 32px;font-family:${FONT};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none">Reply to this person</a>
</td>
</tr>
</tbody></table>
</td></tr>`
    : "";

  const policyLine =
    kind === "feedback"
      ? `<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;color:#4b5563;mso-line-height-rule:exactly;line-height:22px">Feedback is handled under the Lotus Care complaints and compliments policy. Acknowledge within five working days where contact details were given.</p>`
      : "";

  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${escapeHtml(SUBJECTS[kind])}</title>
</head>
<body style="margin:0;padding:0;background:#f8f6f3">
<span style="display:none;font-size:1px;color:#f8f6f3;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(preheader)}</span>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f8f6f3">
<tbody><tr>
<td align="center" style="padding:32px 16px">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)">
<tbody>
<tr>
<td bgcolor="#0d6a70" style="background:#0d6a70;padding:32px">
<img src="${LOGO_URL}" width="149" height="40" alt="Lotus Care" style="display:block;width:149px;height:40px;border:0;margin:0 0 20px">
<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1.8px;text-transform:uppercase;color:#ffdce9;mso-line-height-rule:exactly;line-height:16px">Website form</p>
<h1 style="margin:0;font-family:${FONT};font-size:24px;font-weight:bold;color:#ffffff;mso-line-height-rule:exactly;line-height:30px">${escapeHtml(SUBJECTS[kind])}</h1>
</td>
</tr>
<tr>
<td style="padding:32px 32px 0">
<p style="margin:0;font-family:${FONT};font-size:16px;color:#2d3436;mso-line-height-rule:exactly;line-height:26px">${escapeHtml(INTROS[kind])}</p>
</td>
</tr>
${highlightBox}
<tr>
<td style="padding:24px 32px 0">
<p style="${LABEL_STYLE}">Message</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border:2px solid #e5e7eb;border-radius:12px">
<tbody><tr>
<td style="padding:16px;font-family:${FONT};font-size:16px;color:#2d3436;mso-line-height-rule:exactly;line-height:26px;white-space:pre-wrap">${escapeHtml(submission.message)}</td>
</tr>
</tbody></table>
</td>
</tr>
${detailsBlock}
${cta}
<tr>
<td style="padding:24px 32px 32px">
<p style="margin:0;font-family:${FONT};font-size:14px;color:#6b7280;mso-line-height-rule:exactly;line-height:22px">Submitted ${escapeHtml(formatSubmittedAt(new Date()))} · Received via the ${escapeHtml(FORM_LABELS[kind])}</p>
</td>
</tr>
<tr>
<td style="background:#f8f6f3;padding:32px;border-top:1px solid #e5e7eb">
${policyLine}
<p style="margin:0;font-family:${FONT};font-size:12px;color:#6b7280;mso-line-height-rule:exactly;line-height:20px">Lotus Care, Co. Offaly, Ireland · <a href="https://lotuscare.ie" style="color:#0d6a70;text-decoration:underline">lotuscare.ie</a></p>
</td>
</tr>
</tbody></table>
</td>
</tr>
</tbody></table>
</body></html>`;
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
      to: [RECIPIENT_OVERRIDE || RECIPIENTS[submission.kind]],
      ...(submission.email && { reply_to: submission.email }),
      subject: `${SUBJECTS[submission.kind]} — ${submission.name || "Anonymous"}`,
      html: buildHtml(submission),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the message (${response.status}): ${await response.text()}`);
  }
}
