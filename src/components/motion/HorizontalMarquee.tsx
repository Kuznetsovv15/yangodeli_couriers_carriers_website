"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type HorizontalMarqueeProps = {
  children: ReactNode;
  duration?: number;
  className?: string;
  gap?: string;
};

export function HorizontalMarquee({
  children,
  duration = 36,
  className,
  gap = "gap-5",
}: HorizontalMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track || prefersReducedMotion()) return;

      const half = track.scrollWidth / 2;

      const tween = gsap.fromTo(
        track,
        { x: 0 },
        { x: -half, duration, ease: "none", repeat: -1 }
      );

      const pause = () => tween.pause();
      const play = () => tween.play();

      wrap.addEventListener("mouseenter", pause);
      wrap.addEventListener("mouseleave", play);

      return () => {
        wrap.removeEventListener("mouseenter", pause);
        wrap.removeEventListener("mouseleave", play);
        tween.kill();
      };
    },
    { scope: wrapRef, dependencies: [duration] }
  );

  return (
    <div ref={wrapRef} className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className={cn("flex w-max", gap)}>
        <div className={cn("flex shrink-0", gap)}>{children}</div>
        <div className={cn("flex shrink-0", gap)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
