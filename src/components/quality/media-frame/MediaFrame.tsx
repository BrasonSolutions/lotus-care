import { LotusMark } from "@/components/lotus-mark";

interface MediaFrameProps {
  videoSrc?: string;
  poster?: string;
  caption?: string;
}

export function MediaFrame({ videoSrc, poster, caption }: MediaFrameProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-primary-dark aspect-video">
      <LotusMark
        className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 pointer-events-none"
      />
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={poster}
          controls
          className="relative z-10 w-full h-full object-cover"
        />
      ) : (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8">
          <LotusMark className="w-12 h-12 text-white/70 mb-4" />
          <p className="text-white font-semibold">Video coming soon</p>
          {caption && (
            <p className="text-white/70 text-sm mt-2 max-w-xs">{caption}</p>
          )}
        </div>
      )}
    </div>
  );
}
