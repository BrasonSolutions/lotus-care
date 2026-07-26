import Image from "next/image";

export function LogoDark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Image
        src="/images/logo-icon-color.png"
        alt=""
        width={90}
        height={94}
        className="h-full w-auto object-contain"
        style={{ width: "auto" }}
      />
      <div className="flex flex-col leading-none">
        <span className="text-primary-dark font-bold tracking-[0.14em] text-sm">LOTUS CARE</span>
        <span className="text-muted text-[9px] tracking-[0.2em] font-normal mt-1">ENHANCED LIVING</span>
      </div>
    </div>
  );
}
