"use client";

import { useEffect, useRef, useState } from "react";
import type { Home } from "@/data/homes";

interface HomeModalProps {
  home: Home | null;
  onClose: () => void;
}

export function HomeModal({ home, onClose }: HomeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [lastHomeName, setLastHomeName] = useState(home?.name);

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

  // Reset carousel to first photo whenever a different home is opened
  if (home?.name !== lastHomeName) {
    setLastHomeName(home?.name);
    setCurrentPhoto(0);
  }

  if (!home) return null;

  const prevPhoto = () =>
    setCurrentPhoto((p) => (p - 1 + home.images.length) % home.images.length);
  const nextPhoto = () =>
    setCurrentPhoto((p) => (p + 1) % home.images.length);

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black/50 bg-transparent p-4 w-[92vw] max-w-3xl m-auto"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Details for ${home.name}`}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">

        {/* ── HEADER — image + colour overlay + text ── */}
        <div className="relative h-36 sm:h-48 shrink-0">
          {/* Background photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={home.images[0]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Colour wash overlay */}
          <div
            className="absolute inset-0"
            style={{ background: home.color + "cc" }}
          />
          {/* Text */}
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <h3 className="text-2xl font-bold text-white">{home.name}</h3>
              <p className="text-white/80 text-sm mt-0.5">
                Capacity: {home.capacity} residents
              </p>
            </div>
          </div>
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6">

            {/* Description */}
            <p className="text-foreground leading-relaxed mb-6">
              {home.fullDescription}
            </p>

            {/* Key Features */}
            <h4 className="text-sm font-semibold text-primary-dark mb-3 uppercase tracking-wide">
              Key Features
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
              {home.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <svg
                    className="w-4 h-4 text-primary shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* ── PHOTO CAROUSEL ── */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-primary-dark mb-3 uppercase tracking-wide">
                Photos
              </h4>

              {/* Slide container */}
              <div className="relative overflow-hidden rounded-xl aspect-video">
                <div
                  className="flex h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentPhoto * 100}%)` }}
                >
                  {home.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`${home.name} — photo ${i + 1}`}
                      className="w-full h-full object-cover shrink-0"
                    />
                  ))}
                </div>

                {/* Left arrow */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors focus-ring-white"
                  aria-label="Previous photo"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Right arrow */}
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors focus-ring-white"
                  aria-label="Next photo"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {home.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className="p-1 focus-ring rounded-full"
                    aria-label={`Photo ${i + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-all ${
                        i === currentPhoto
                          ? "w-6 h-2 bg-primary"
                          : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors focus-ring"
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </dialog>
  );
}
