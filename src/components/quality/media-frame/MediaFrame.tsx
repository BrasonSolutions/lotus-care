import { LotusMark } from "@/components/lotus-mark";

interface MediaFrameProps {
  videoSrc?: string;
  poster?: string;
  caption?: string;
}

const cornerStyles = [
  "top-2 left-2 sm:top-3 sm:left-3 rotate-0",
  "top-2 right-2 sm:top-3 sm:right-3 rotate-90",
  "bottom-2 right-2 sm:bottom-3 sm:right-3 rotate-180",
  "bottom-2 left-2 sm:bottom-3 sm:left-3 -rotate-90",
];

export function MediaFrame({ videoSrc, poster, caption }: MediaFrameProps) {
  return (
    <div className="relative rounded-2xl bg-white border border-gray-100 shadow-sm p-3 sm:p-4">
      {cornerStyles.map((position) => (
        <LotusMark
          key={position}
          className={`absolute w-7 h-7 sm:w-8 sm:h-8 text-primary/30 pointer-events-none ${position}`}
        />
      ))}

      <div className="relative z-10 rounded-xl overflow-hidden bg-primary-dark aspect-video">
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-cover bg-center"
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
          >
            <div className="absolute inset-0 bg-primary-dark/60" aria-hidden="true" />
            <LotusMark className="relative w-12 h-12 text-white/70 mb-4" />
            <p className="relative text-white font-semibold">Video coming soon</p>
            {caption && (
              <p className="relative text-white/70 text-sm mt-2 max-w-xs">{caption}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
