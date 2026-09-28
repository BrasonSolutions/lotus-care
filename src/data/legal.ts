// Privacy Policy: final, client-supplied copy (see the note above it).
// Terms of Service: draft — drafted against Lotus Care's own real facts drawn
// from this codebase; anything Lotus Care itself must supply or confirm is
// marked "[Lotus Care to confirm: ...]" rather than invented. Not reviewed by
// a solicitor, so it renders with the "pending legal review" notice (`draft`).

export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
  /** Rendered as h3s beneath this section's own body/list. */
  subsections?: LegalSection[];
  /** Paragraphs that follow the list/subsections, e.g. a closing note. */
  after?: string[];
}

export interface LegalDoc {
  title: string;
  description: string;
  /** Shows the "pending legal review" notice at the top of the page. */
  draft?: boolean;
  intro: string[];
  sections: LegalSection[];
}

// Client-supplied final copy ("Lotus Care Privacy Policy.docx", Sep 2026),
// transcribed verbatim — edit only against a newer version of that document.
export const privacyPolicy: LegalDoc = {
  title: "Privacy Policy",
  description: "How Lotus Care collects, uses and protects your personal data.",
  intro: [
    "Protecting your personal information is something Lotus Care takes seriously. This Policy explains how we collect, use, store, share, retain and otherwise handle (“process”) your personal data, the safeguards we have in place, and how to reach us if you have any questions.",
  ],
  sections: [
    {
      heading: "Who we are and who this Policy applies to",
      body: [
        "This Policy applies across all of Lotus Care's activities and locations, wherever the General Data Protection Regulation or the Data Protection Act 2018 applies to our operations.",
        "It covers personal data we collect and process, whether obtained directly from you or from other sources, about anyone connected with Lotus Care — including current, former and prospective employees, job applicants, the people we support and their families, suppliers, contractors, subcontractors, and any other third parties we deal with. “Personal data” means any information relating to a living individual who is identified, or who could reasonably be identified, from that information.",
        "Throughout this Policy, “you” and “your” mean any individual whose data is covered by it, and “we”, “us”, “our” and “Lotus Care” mean Lotus Care.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "Lotus Care is committed to upholding your rights under applicable data protection law. These rights are summarised below.",
      ],
      subsections: [
        {
          heading: "Right of access and rectification",
          body: [
            "You can ask us for a copy of the Personal Data we hold about you. You can also ask us to correct any inaccurate Personal Data, or to complete any Personal Data that is incomplete.",
          ],
        },
        {
          heading: "Right to erasure",
          body: [
            "You have the right to ask us to erase your Personal Data — sometimes known as the “right to be forgotten” — in circumstances including where:",
          ],
          list: [
            "the data is no longer needed for the purpose it was collected for;",
            "you withdraw your consent;",
            "you object to our processing of your data;",
            "your data has been processed unlawfully;",
            "erasure is required to meet a legal obligation; or",
            "erasure is needed to ensure compliance with applicable law.",
          ],
        },
        {
          heading: "Right to restriction of processing",
          body: ["You can ask us to restrict how we process your Personal Data where:"],
          list: [
            "you dispute the accuracy of your data;",
            "Lotus Care no longer needs the data for the purposes of processing; or",
            "you have objected to processing on legitimate grounds.",
          ],
        },
        {
          heading: "Right to data portability",
          body: [
            "Where applicable, you can ask for the Personal Data you have provided to us to be given to you in a structured, commonly used and machine-readable format, so that you can transfer it to another organisation without hindrance from Lotus Care, where:",
          ],
          list: [
            "the processing is based on your consent or on a contract; and",
            "the processing is carried out by automated means.",
          ],
          after: [
            "You may also ask us to send this data directly to a third party of your choosing, where this is technically feasible.",
          ],
        },
        {
          heading: "Right to object to processing",
          body: [
            "You can object to — or “opt out” of — our processing of your Personal Data, particularly where it relates to profiling or marketing communications. Where our processing is based on your consent, you can withdraw that consent at any time.",
          ],
        },
        {
          heading: "Right not to be subject to automated decisions",
          body: [
            "You have the right not to be subject to a decision based solely on automated processing, including profiling, that produces a legal effect concerning you or otherwise significantly affects you.",
          ],
        },
        {
          heading: "Right to lodge a Complaint",
          body: [
            "You are entitled to lodge a complaint with the Data Protection Supervisory Authority in the country where you habitually reside, where you work, or where the alleged infringement took place, regardless of whether you have suffered any damage as a result.",
            "You also have the right to bring a complaint before the courts in the jurisdiction where Lotus Care is established, or where you habitually reside.",
          ],
        },
      ],
      after: [
        "To exercise any of these rights, please email your request to our Data Protection Officer at dpo@lotuscare.ie.",
      ],
    },
    {
      heading: "The legal basis for processing your data",
      body: [
        "We process personal data in line with the requirements of European data protection law and any other relevant local law, and we are committed to meeting our obligations under this legislation on an ongoing basis.",
        "We only collect and process your personal data where we have a valid legal basis to do so. This may include situations where processing is necessary to deliver a contract with you, to comply with a legal obligation, or because you have given us your consent. We may also process your data where it serves a legitimate interest of Lotus Care, provided this is not outweighed by your own interests, rights or freedoms.",
        "When we collect your personal data, we will, wherever practical, provide you with clear information about who is responsible for processing it, why we are processing it, who may receive it, and what rights are available to you and how to exercise them. The only exception is where doing so would be impossible or would require disproportionate effort. Where the law requires it — for instance, before collecting any special category (Sensitive) personal data — we will obtain your consent beforehand.",
      ],
    },
    {
      heading: "How and why we use your data",
      body: [
        "Personal data is collected by Lotus Care only for specified, clear and lawful purposes, and it is not processed in any way that is incompatible with those purposes.",
        "Where we process personal data for our own purposes, this generally supports activities such as: recruitment and workforce planning; human resources administration and employee relations; payroll, accounting and financial reporting; treasury and tax management; risk management and health and safety; operation of our IT systems, intranet, digital tools and collaborative platforms; IT and information security support; management of relationships with the people we support and their families; funding applications, tendering and business development; procurement and supplier management; internal and external communications and events; compliance with anti-money laundering and other regulatory obligations; data analytics; and general legal, corporate and governance matters.",
      ],
    },
    {
      heading: "Keeping your data accurate and how long we keep it",
      body: [
        "We take reasonable steps to keep the personal data we hold accurate and, where needed, up to date. We retain personal data only for as long as necessary to fulfil the purpose it was collected for, including to satisfy any applicable legal, accounting or regulatory retention obligations, or, where relevant, until any associated legal claim has been concluded. Details of our specific retention periods can be found in our internal retention policy, available on request by emailing dpo@lotuscare.ie.",
        "Once the applicable retention period has passed, we securely dispose of your personal data in line with applicable law and regulation.",
      ],
    },
    {
      heading: "Data security and information sharing",
      body: [
        "We apply appropriate technical and organisational measures to guard personal data against accidental loss or alteration, and against unauthorised access, use or disclosure, in accordance with our internal information and systems security standards.",
        "Where appropriate, we apply privacy-by-design and privacy-by-default principles to build in the safeguards needed to protect personal data, and we carry out privacy impact assessments where the level of risk associated with particular processing warrants it. Additional safeguards are applied where the data concerned is Sensitive Personal Data.",
        "We may share your personal data in the following circumstances:",
      ],
      list: [
        "with other parts of Lotus Care, for the purposes described in this Policy;",
        "with third-party service providers we engage in connection with the purposes described in this Policy and the services we deliver;",
        "with organisations that carry out anti-money laundering, terrorist financing or other fraud and crime prevention checks on our behalf, including financial institutions and regulatory bodies;",
        "with courts, law enforcement bodies, regulators, government officials, or legal advisers, where reasonably necessary to establish, exercise or defend a legal claim, or as part of a confidential dispute resolution process;",
        "with service providers we engage to process personal data on our behalf and strictly in accordance with our instructions, for any of the purposes set out above;",
        "in the context of a sale, transfer or restructuring of any part of our business or assets, where personal data may need to be disclosed to a prospective buyer or seller as part of that transaction.",
      ],
    },
    {
      heading: "Automated tools and artificial intelligence",
      body: [
        "We may, from time to time, use automated tools, including AI-based systems, as part of how we operate. Where we do, we only use such tools in ways that are consistent with the purposes described in this Policy and in line with applicable data protection law, and this may sometimes involve trusted service providers acting on our behalf under appropriate data protection agreements.",
        "You will not be subject to a decision based solely on automated processing where that decision would have a legal or similarly significant effect on you; appropriate human oversight applies in those circumstances. Appropriate safeguards are in place to protect the security and confidentiality of your personal data.",
      ],
    },
    {
      heading: "Where your data is held",
      body: [
        "Lotus Care operates entirely within Ireland, and we do not transfer your personal data outside of Ireland. Your personal data is processed and stored within Ireland in accordance with this Policy and applicable Irish and European data protection law.",
        "Should this position change in the future, we will update this Policy accordingly and, where required, inform you of any such transfer, the safeguards in place, and your related rights, at the time your data is collected. If you have any questions about how or where your personal data is processed, please contact us at dpo@lotuscare.ie.",
      ],
    },
    {
      heading: "Cookies and website analytics",
      body: [
        "This website uses Cloudflare Web Analytics to understand overall site usage. It is cookie-less and does not use cross-site identifiers or track individual visitors. We do not otherwise place tracking or advertising cookies on this website.",
      ],
    },
    {
      heading: "Children's data",
      body: [
        "Children are entitled to specific protection in relation to their personal data, as they may be less aware of the risks and safeguards involved and of their own rights. This is particularly relevant where personal data relating to children is used for marketing purposes or to build personal or user profiles, and where services are offered directly to a child.",
        "We do not knowingly collect or process a child's personal data without the consent of the person holding parental responsibility, where this is required. We do not market our services directly to children, other than in relation to specific services and with the appropriate parental consent. If you believe we have inadvertently collected a child's personal data without the required consent, please contact us using the details below.",
      ],
    },
    {
      heading: "Changes to this Policy",
      body: [
        "We may update this Policy from time to time to reflect changes in our business or in applicable legal requirements.",
      ],
    },
    {
      heading: "Contact us",
      body: [
        "If you have any questions, comments or requests relating to this Policy, please contact our Data Protection Officer at dpo@lotuscare.ie.",
      ],
    },
  ],
};

export const termsOfService: LegalDoc = {
  title: "Terms of Service",
  description: "The terms that apply to using this website.",
  draft: true,
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
