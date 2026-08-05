"use client";

import { useState } from "react";
import type { FAQ } from "@/data/careers";

interface FaqAccordionProps {
  faqs: FAQ[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <dl className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <dt>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex items-center justify-between w-full px-5 py-4 text-left focus-ring rounded-xl"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-primary-dark pr-4">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 shrink-0 text-primary transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </dt>
            <dd
              className={`faq-panel overflow-hidden ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 pb-5 text-sm text-foreground leading-relaxed">
                {faq.answer}
              </p>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
