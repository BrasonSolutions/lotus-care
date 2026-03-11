"use client";

import { useEffect, useRef } from "react";
import type { Home } from "@/data/homes";

interface HomeModalProps {
  home: Home | null;
  onClose: () => void;
}

export default function HomeModal({ home, onClose }: HomeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (home) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.close();
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [home]);

  if (!home) return null;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-4 max-w-lg w-full m-auto"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Details for ${home.name}`}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="h-32 flex items-end p-6"
          style={{ background: `linear-gradient(135deg, ${home.color}40, ${home.color}20)` }}
        >
          <div>
            <h3 className="text-2xl font-bold text-primary-dark">{home.name}</h3>
            <p className="text-sm text-muted">Capacity: {home.capacity} residents</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-foreground leading-relaxed mb-6">
            {home.fullDescription}
          </p>

          <h4 className="text-sm font-semibold text-primary-dark mb-3 uppercase tracking-wide">
            Key Features
          </h4>
          <ul className="grid grid-cols-2 gap-2 mb-6">
            {home.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
