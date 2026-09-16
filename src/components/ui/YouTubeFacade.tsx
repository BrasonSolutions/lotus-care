"use client";

import { useState } from "react";
import Image from "next/image";

interface YouTubeFacadeProps {
  /** The part of the youtu.be/ URL after the slash. */
  youtubeId: string;
  /** Used as the iframe's accessible title and the play button's aria-label. */
  title: string;
  /** Passed to the poster `Image`'s `sizes` — match the rendered width. */
  sizes?: string;
}

const DEFAULT_SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Click-to-play YouTube embed. Shows YouTube's own thumbnail behind our own
 * play-button styling until clicked, then swaps in the real iframe — so
 * nothing from YouTube loads, and no YouTube branding shows, before playback
 * is actually requested. Fills its parent; parent controls aspect ratio.
 */
export function YouTubeFacade({ youtubeId, title, sizes = DEFAULT_SIZES }: YouTubeFacadeProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
        className="w-full h-full"
        allow="accelerated-video-decode; encrypted-media; picture-in-picture; autoplay"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group absolute inset-0 w-full h-full focus-ring"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
        alt={title}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-full bg-white/85 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg className="w-5 h-5 text-primary translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
