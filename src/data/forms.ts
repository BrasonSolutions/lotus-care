/** Field definitions for the site's forms — see components/contact-form. */

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: string[];
  rows?: number;
  /** Sits beside the next field on wider screens instead of full width. */
  half?: boolean;
}

const name: FormField = {
  name: "name",
  label: "Full Name",
  type: "text",
  required: true,
  autoComplete: "name",
  placeholder: "Your name",
  half: true,
};

const email: FormField = {
  name: "email",
  label: "Email Address",
  type: "email",
  required: true,
  autoComplete: "email",
  placeholder: "you@example.com",
  half: true,
};

const phone: FormField = {
  name: "phone",
  label: "Phone Number",
  type: "tel",
  autoComplete: "tel",
  placeholder: "+353 ...",
};

const message = (placeholder: string, rows = 4): FormField => ({
  name: "message",
  label: "Message",
  type: "textarea",
  required: true,
  rows,
  placeholder,
});

/**
 * Referral form. Extra referral-specific fields are still to be confirmed
 * with the client (issue #86), so it stays on the shared template for now.
 */
export const referralFields: FormField[] = [
  name,
  email,
  phone,
  message("Tell us about the person being referred and how we can help…", 5),
];

export const contactFields: FormField[] = [
  name,
  email,
  phone,
  message("How can we help?", 4),
];

export const recruitmentRoles = [
  "Residential Support Worker",
  "Night Support Worker",
  "Social Care Leader",
  "Staff Nurse (RNID/RNMH)",
  "Senior Services Manager",
  "Clinical / Allied Health",
  "Administration",
  "Other",
];

export const recruitmentFields: FormField[] = [
  name,
  email,
  phone,
  {
    name: "role",
    label: "Role Type of Interest",
    type: "select",
    options: recruitmentRoles,
    placeholder: "Select a role type…",
  },
  message("Tell us about yourself or your question…", 4),
];
