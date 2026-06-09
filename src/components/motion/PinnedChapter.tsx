"use client";

import { useGSAP } from "@gsap/react";
import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { isMobile, prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type PinnedChapterProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  pinDuration?: string;
  compact?: boolean;
};

export function PinnedChapter({
  id,
  children,
  className,
  pinDuration = "+=65%",
  compact = false,
}: PinnedChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!section || !pin || prefersReducedMotion() || isMobile()) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: pinDuration,
          pin,
          pinSpacing: true,
          scrub: 0.45,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "scroll-chapter scroll-chapter--pin relative",
        compact && "scroll-chapter--compact",
        className
      )}
    >
      <div ref={pinRef} className="chrome-pin-safe chrome-pin-safe--viewport w-full">
        <div className="chrome-pin-safe__inner w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
