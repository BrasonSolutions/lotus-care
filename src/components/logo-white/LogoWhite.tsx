import { LotusMark } from "@/components/lotus-mark";

export function LogoWhite({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LotusMark tone="mono" className="h-full w-auto text-white" />
      <div className="flex flex-col leading-none">
        <span className="text-white font-bold tracking-[0.14em] text-sm">LOTUS CARE</span>
        <span className="text-white/80 text-xs tracking-[0.2em] font-normal mt-1">ENHANCED LIVING</span>
      </div>
    </div>
  );
}
