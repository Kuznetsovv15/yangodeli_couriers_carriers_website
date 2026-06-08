"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

export type FlyDirection = "left" | "right" | "top" | "bottom";

const flyFrom: Record<FlyDirection, { x: number; y: number }> = {
  left: { x: -80, y: 0 },
  right: { x: 80, y: 0 },
  top: { x: 0, y: -60 },
  bottom: { x: 0, y: 60 },
};

type FlyInProps = {
  children: ReactNode;
  from: FlyDirection;
  className?: string;
  delay?: number;
};

export function FlyIn({ children, from, className, delay = 0 }: FlyInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const offset = flyFrom[from];
      gsap.from(el, {
        x: offset.x,
        y: offset.y,
        opacity: 0,
        duration: 0.85,
        delay,
        ease: from === "top" ? "back.out(1.6)" : "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    },
    { dependencies: [from, delay] }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
