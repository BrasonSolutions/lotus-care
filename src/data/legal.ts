// Draft legal content — see the notice rendered at the top of both pages.
// Structurally based on a comparable Irish residential care provider's
// published privacy policy (GDPR principles/rights sections are standard,
// reusable language, not specific to them), then rewritten against Lotus
// Care's own real facts drawn from this codebase (contactInfo in
// data/navigation.ts, the services actually offered, and the fact this site
// only ever collects name/email/phone/message via its forms — see
// lib/forms.ts — and runs Vercel's cookieless Web Analytics, not tracking
// cookies). Anything Lotus Care itself must supply or confirm — not
// derivable from the site or its code — is marked "[Lotus Care to confirm: ...]"
// rather than invented. Not reviewed by a solicitor; do not publish as final
// without that review — see LegalDocument's DRAFT_NOTICE.

export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  intro: string[];
  sections: LegalSection[];
}

export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  description: "How Lotus Care collects, uses and protects your personal data.",
  intro: [
    "Lotus Care Limited (“Lotus Care”, “we”, “us”) respects your right to privacy. Whether you deal with us as a Service Owner, family member, employee, referrer, external professional or website visitor, you are entitled to the protection of your personal data. This policy explains what personal data we collect, why, and how it is handled and stored, in line with the EU General Data Protection Regulation (GDPR) and Irish data protection law.",
  ],
  sections: [
    {
      heading: "Who is responsible for your personal data?",
      body: [
        "For the purposes of the GDPR, the data controller is Lotus Care Limited, registered office: Suite 204, Birr Technology Park, St Brendans Park, Birr, Co. Offaly, R42 HX39.",
      ],
    },
    {
      heading: "Who can you contact?",
      body: [
        "For any question, request or complaint about this policy or your personal data, contact us at info@lotuscare.ie or 057 910 7107. [Lotus Care to confirm: a dedicated Data Protection contact, if one exists, should be added here in place of the general office line.]",
      ],
    },
    {
      heading: "The principles we apply",
      body: ["Personal data must be collected and used fairly, stored safely, and never disclosed unlawfully. We apply the following principles:"],
      list: [
        "Lawfulness — we collect personal data fairly, lawfully and transparently.",
        "Data minimisation — we limit collection to what is directly relevant and necessary.",
        "Purpose limitation — we collect data for specified, legitimate purposes and do not use it in incompatible ways.",
        "Accuracy — we keep personal data accurate and up to date.",
        "Security — we use technical and organisational measures to prevent unauthorised access, disclosure, loss or alteration.",
        "Retention limitation — we keep personal data only for as long as necessary for the purpose it was collected for.",
        "Safeguards for third parties — any sharing of data with third parties is carried out lawfully and with appropriate safeguards.",
        "Lawfulness of marketing and cookies — any promotional communication or use of cookies is carried out in line with applicable law.",
      ],
    },
    {
      heading: "What information do we collect?",
      body: [
        "Through this website, we collect only what you give us directly through our contact, referral and recruitment forms: your name, email address, phone number (optional), and the content of your message. We do not use tracking cookies on this website — we use Vercel Web Analytics, which does not use cookies or cross-site identifiers.",
        "Separately from the website, as a HIQA-registered provider of residential and non-residential respite services, we also collect and process further personal data — which may include medical, educational and welfare information — about the children and adults we support (our “Service Owners”), as part of delivering that care. [Lotus Care to confirm the categories of data collected during referral, admission and ongoing care, and how this section should describe them.]",
      ],
    },
    {
      heading: "How do we use your information, and on what legal basis?",
      body: [
        "We process personal data for the purpose of providing residential and non-residential respite services to children and adults with additional needs, and to respond to enquiries, referrals and job applications made through this website.",
        "Our legal basis for processing is: (i) our legitimate interest in operating and improving our services and this website; (ii) performance of a contract, where we are providing services to a Service Owner or their family; and (iii) in some cases, to protect the vital interests of the person concerned. Where we process special category data (such as health information) about a Service Owner, we rely on the legal basis of carrying out our obligations in the field of social protection and care law, and, in some cases, protecting vital interests.",
      ],
    },
    {
      heading: "Is my personal data secure?",
      body: [
        "We use appropriate technical, organisational and administrative measures to protect the personal data we hold from loss, misuse, unauthorised access, disclosure, alteration and destruction, consistent with current industry practice. Any third party that processes personal data on our behalf is required to apply equivalent safeguards.",
      ],
    },
    {
      heading: "How long do we keep your data?",
      body: [
        "We keep personal data only for as long as necessary to fulfil the purpose it was collected for, including any legal, regulatory or reporting requirement. As a HIQA-registered and, for children’s services, Tusla-notified provider, specific retention periods for care and employment records are set by regulatory requirements. [Lotus Care to confirm exact retention periods for Service Owner records, employment records, and website enquiry data.]",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "This website uses Vercel Web Analytics to understand overall site usage. It is cookieless and does not use cross-site identifiers or track individual visitors. We do not otherwise place tracking or advertising cookies on this website.",
      ],
    },
    {
      heading: "Who do we share your data with?",
      body: ["Depending on the purpose it was collected for, we may share personal data with:"],
      list: [
        "Our own authorised staff, on a need-to-know basis.",
        "Regulatory and statutory bodies, including HIQA and, for children’s services, Tusla, where required by law or regulation.",
        "Healthcare, education and other professionals directly involved in a Service Owner’s care, with appropriate authorisation.",
        "Legal or professional advisors, where necessary to protect our rights or comply with the law.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Under the GDPR, you have the right to: access the personal data we hold about you; request its correction if inaccurate; request its erasure in certain circumstances; object to processing based on our legitimate interest; withdraw consent at any time where we rely on it; and request that your data be transferred to another controller. We will respond to any request within one month. You also have the right to lodge a complaint with the Data Protection Commission (www.dataprotection.ie).",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this policy from time to time. Material changes will be reflected on this page. You are responsible for reviewing it periodically.",
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms of Service",
  description: "The terms that apply to using this website.",
  intro: [
    "These terms apply to your use of the lotuscare.ie website only. They do not form, and are not intended to form, the contract between Lotus Care and a Service Owner or their family for the provision of care — that is set out in a separate service agreement entered into directly with Lotus Care. [Lotus Care to confirm this distinction, and whether a separate reference to that agreement should be added here.]",
  ],
  sections: [
    {
      heading: "Using this website",
      body: [
        "This website is provided for general information about Lotus Care and its services, and to let you make an enquiry, referral or job application. You agree to use it only for lawful purposes and not to attempt to disrupt or gain unauthorised access to it.",
      ],
    },
    {
      heading: "Accuracy of information",
      body: [
        "We take care to keep the information on this website accurate and up to date, but it is provided for general guidance only and should not be relied on as a substitute for direct contact with our team about a specific person’s needs. Nothing on this website constitutes medical, clinical or legal advice.",
      ],
    },
    {
      heading: "Forms and submitted information",
      body: [
        "When you submit a contact, referral or job application form, the information is used only to respond to that enquiry — see our Privacy Policy for how that data is handled.",
      ],
    },
    {
      heading: "External links",
      body: [
        "This website may link to third-party websites. We are not responsible for the content or privacy practices of any site we do not operate.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The content of this website, including text, images and logos, is owned by or licensed to Lotus Care and may not be reproduced without permission.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "These terms are governed by the laws of Ireland, and any dispute relating to them is subject to the exclusive jurisdiction of the Irish courts.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these terms from time to time. Material changes will be reflected on this page.",
      ],
    },
    {
      heading: "Contact",
      body: ["Questions about these terms can be sent to info@lotuscare.ie or 057 910 7107."],
    },
  ],
};
