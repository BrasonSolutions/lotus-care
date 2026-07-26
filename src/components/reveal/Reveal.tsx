"use client";

import { useInView } from "@/hooks/use-in-view";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3 | 4 | 5;
  threshold?: number;
}

export function Reveal({ children, className, delay, threshold = 0.1 }: RevealProps) {
  const { ref, inView } = useInView({ threshold });
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`reveal ${delayClass} ${inView ? "in-view" : ""} ${className ?? ""}`}>
      {children}
    </div>
  );
}
