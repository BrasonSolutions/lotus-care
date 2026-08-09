import { LotusMark } from "@/components/lotus-mark";

export function LogoDark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LotusMark tone="color" className="h-full w-auto" />
      <div className="flex flex-col leading-none">
        <span className="text-primary-dark font-bold tracking-[0.14em] text-sm">LOTUS CARE</span>
        <span className="text-muted text-xs tracking-[0.2em] font-normal mt-1">ENHANCED LIVING</span>
      </div>
    </div>
  );
}
