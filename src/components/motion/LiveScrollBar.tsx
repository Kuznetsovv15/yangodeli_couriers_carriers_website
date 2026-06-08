"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type LiveScrollBarProps = {
  sections: Array<{ id: string; label: string }>;
};

export function LiveScrollBar({ sections }: LiveScrollBarProps) {
  const reducedMotion = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    if (reducedMotion || !barRef.current) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.2,
        onUpdate: (self) => setProgress(self.progress),
      },
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.85,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  });

  useEffect(() => {
    const triggers = sections.map((section, index) =>
      ScrollTrigger.create({
        trigger: `#${section.id}`,
        start: "top 45%",
        end: "bottom 45%",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, [sections]);

  if (reducedMotion) return null;

  const active = sections[activeIndex];

  return (
    <>
      <div className="live-scroll-track fixed inset-x-0 top-0 z-[110] h-[2px]" aria-hidden>
        <div className="absolute inset-0 bg-brand-border" />
        <div
          ref={barRef}
          className="live-scroll-fill absolute inset-y-0 start-0 w-full origin-left scale-x-0"
        />
        <div
          ref={glowRef}
          className="live-scroll-glow absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
          style={{ insetInlineStart: `calc(${progress * 100}% - 4px)` }}
        />
      </div>

      <div className="pointer-events-none fixed start-1/2 top-[4.5rem] z-[105] -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="live-chapter-pill flex items-center gap-2 rounded-full px-3 py-1"
          >
            <span className="font-heading text-xs font-bold text-brand-text">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="h-3 w-px bg-brand-border" />
            <span className="max-w-[200px] truncate text-xs text-brand-muted">
              {active.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
