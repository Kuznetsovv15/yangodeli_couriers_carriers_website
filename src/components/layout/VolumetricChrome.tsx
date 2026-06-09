"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollTrigger } from "@/lib/gsap-config";
import { cn } from "@/lib/utils";

type VolumetricChromeProps = {
  ticker?: ReactNode;
  header: ReactNode;
  className?: string;
};

export function VolumetricChrome({ ticker, header, className }: VolumetricChromeProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const root = document.documentElement;
    const update = () => {
      const measuredBottom = el.getBoundingClientRect().bottom;
      const fallback =
        parseFloat(getComputedStyle(root).getPropertyValue("--chrome-height")) || 0;
      const effective = Math.max(measuredBottom, fallback);

      root.style.setProperty("--chrome-height-measured", `${measuredBottom}px`);
      root.style.setProperty("--chrome-height-effective", `${effective}px`);
      ScrollTrigger.refresh();
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      root.style.removeProperty("--chrome-height-measured");
      root.style.removeProperty("--chrome-height-effective");
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={shellRef}
      data-scrolled={scrolled}
      className={cn("site-chrome fixed inset-x-0 top-0 z-50", className)}
    >
      <ScrollProgress embedded />
      <div className="volumetric-chrome volumetric-chrome--fullwidth">
        <div className="volumetric-chrome__glow" aria-hidden />
        <div className="volumetric-chrome__body">
          {ticker}
          {header}
        </div>
      </div>
    </div>
  );
}
