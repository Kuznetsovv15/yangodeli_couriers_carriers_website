"use client";

import { useGSAP } from "@gsap/react";
import { useLocale } from "next-intl";
import { type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import { isMobile, prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

type HorizontalPinSectionProps = {
  id?: string;
  intro: ReactNode;
  panels: ReactNode[];
  className?: string;
};

export function HorizontalPinSection({
  id,
  intro,
  panels,
  className,
}: HorizontalPinSectionProps) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track || prefersReducedMotion() || isMobile()) return;

      const scrollDistance = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      const scrollTween = gsap.to(track, {
        x: () => (isRtl ? scrollDistance() : -scrollDistance()),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(scrollDistance(), window.innerWidth)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const panelEls = gsap.utils.toArray<HTMLElement>(".pin-panel", track);
      panelEls.forEach((panel) => {
        const inner = panel.querySelector(".pin-panel__inner");
        if (!inner) return;

        gsap.fromTo(
          inner,
          { scale: 1.08, opacity: 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: isRtl ? "right 90%" : "left 90%",
              end: isRtl ? "right 35%" : "left 35%",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef, dependencies: [panels.length, locale] }
  );

  return (
    <section ref={sectionRef} id={id} className={cn("scroll-chapter relative", className)}>
      <div className="px-4 py-16 md:hidden md:px-8">{intro}</div>

      <div className="flex flex-col gap-6 px-4 pb-16 md:hidden">{panels}</div>

      <div
        ref={trackRef}
        dir={isRtl ? "rtl" : "ltr"}
        className="chrome-pin-safe chrome-pin-safe--viewport hidden md:flex md:flex-row md:items-center md:gap-10 md:px-0 will-change-transform"
      >
        <div className="pin-panel shrink-0 md:flex md:h-full md:w-[min(42vw,520px)] md:flex-col md:justify-center md:ps-12 md:text-start lg:ps-16">
          <div className="pin-panel__inner">{intro}</div>
        </div>

        {panels.map((panel, i) => (
          <div
            key={i}
            className="pin-panel relative shrink-0 md:h-[78vh] md:w-[min(52vw,640px)]"
          >
            <div className="pin-panel__inner h-full">{panel}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
