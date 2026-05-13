import Image from "next/image";

export function LogoWhite({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Image
        src="/images/logo-white-notext.png"
        alt=""
        width={80}
        height={80}
        className="h-full w-auto object-contain"
        style={{ width: "auto" }}
      />
      <div className="flex flex-col leading-none">
        <span className="text-white font-bold tracking-[0.14em] text-sm">LOTUS CARE</span>
        <span className="text-white/70 text-[9px] tracking-[0.2em] font-normal mt-1">ENHANCED LIVING</span>
      </div>
    </div>
  );
}
