"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { type ReactNode, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { measureSpreadDistance } from "@/lib/spread-distance";
import { cn } from "@/lib/utils";

type ScrollSpreadSectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Pin section while user scrolls through the chapter */
  pin?: boolean;
  /** Animate .spread-child elements apart on scroll */
  spread?: boolean;
  /** Scroll distance while pinned, e.g. "+=80%" */
  pinDuration?: string;
  compact?: boolean;
};

export function ScrollSpreadSection({
  id,
  children,
  className,
  pin = true,
  spread = true,
  pinDuration = "+=55%",
  compact = false,
}: ScrollSpreadSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isRtl = locale === "he";
  const spreadSign = isRtl ? -1 : 1;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const shouldPin = pin && !isMobile;
      const targets = spread
        ? gsap.utils.toArray<HTMLElement>(".spread-child", root)
        : [];

      const getDistance = () => measureSpreadDistance(root, targets, spreadSign);

      const scrollTriggerConfig = {
        trigger: root,
        start: "top top",
        end: pinDuration,
        scrub: 0.35,
        pin: shouldPin,
        pinSpacing: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      };

      if (targets.length > 0) {
        const bound = root.querySelector<HTMLElement>("[data-spread-bound]");
        if (bound) gsap.set(bound, { transformPerspective: 1200 });

        const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

        targets.forEach((el, i) => {
          const spreadIndex = (i - (targets.length - 1) / 2) * spreadSign;
          const from = isMobile
            ? {
                scale: 0.92,
                opacity: 0.45,
                x: 0,
                y: spreadIndex * 32,
                rotateY: 0,
                z: 0,
              }
            : {
                scale: 0.9,
                opacity: 0.45,
                x: () => -spreadIndex * getDistance(),
                y: 0,
                rotateY: () => -spreadIndex * 4,
                z: 0,
              };
          const to = {
            x: 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            z: 0,
          };

          tl.fromTo(el, from, { ...to, ease: "power2.out", duration: 1 }, 0);
        });
      } else if (shouldPin) {
        ScrollTrigger.create(scrollTriggerConfig);
      }
    },
    { scope: ref, dependencies: [locale, pin, spread, pinDuration] }
  );

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        "scroll-spread-section scroll-chapter",
        pin && "scroll-chapter--pin chrome-pin-safe chrome-pin-safe--viewport",
        compact && "scroll-chapter--compact",
        className
      )}
    >
      <div className={cn("spread-stage", pin && "chrome-pin-safe__inner spread-stage--pinned")}>
        {children}
      </div>
    </div>
  );
}
