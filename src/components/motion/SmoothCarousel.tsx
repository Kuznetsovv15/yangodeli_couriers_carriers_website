"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { CAROUSEL_SLIDE_MS } from "@/lib/carousel-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type SmoothCarouselProps = {
  itemCount: number;
  intervalMs?: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  renderSlide: (index: number) => ReactNode;
  className?: string;
};

function ProgressBar({
  index,
  activeIndex,
  progress,
}: {
  index: number;
  activeIndex: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const width = useTransform(progress, (v) => {
    if (index < activeIndex) return "100%";
    if (index > activeIndex) return "0%";
    return `${v * 100}%`;
  });

  return (
    <motion.span
      className="absolute inset-y-0 start-0 rounded-full bg-brand-primary"
      style={{ width }}
    />
  );
}

export function SmoothCarousel({
  itemCount,
  intervalMs = CAROUSEL_SLIDE_MS,
  activeIndex,
  onIndexChange,
  renderSlide,
  className,
}: SmoothCarouselProps) {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const progress = useMotionValue(0);
  const smoothProgress = useSpring(progress, { stiffness: 50, damping: 18 });

  const goTo = useCallback(
    (index: number, dir = 1) => {
      setDirection(dir);
      onIndexChange(index);
      progress.set(0);
    },
    [onIndexChange, progress]
  );

  const advance = useCallback(() => {
    const next = (activeIndex + 1) % itemCount;
    goTo(next, 1);
  }, [activeIndex, goTo, itemCount]);

  useEffect(() => {
    if (reducedMotion || itemCount < 2 || paused) return;

    progress.set(0);
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      progress.set(Math.min(elapsed / intervalMs, 1));
      if (elapsed < intervalMs) {
        frame = requestAnimationFrame(tick);
      } else {
        advance();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, advance, intervalMs, itemCount, paused, progress, reducedMotion]);

  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -40 : 40 }),
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative min-h-[180px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderSlide(activeIndex)}
          </motion.div>
        </AnimatePresence>
      </div>

      {itemCount > 1 && (
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: itemCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i, i > activeIndex ? 1 : -1)}
              className="group relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-brand-border"
            >
              <ProgressBar index={i} activeIndex={activeIndex} progress={smoothProgress} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
