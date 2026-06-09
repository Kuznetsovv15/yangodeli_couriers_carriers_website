"use client";

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, useCallback, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap-config";
import { isMobile, prefersReducedMotion } from "@/lib/motion-utils";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { ClickCarousel3D } from "@/components/motion/ClickCarousel3D";

type ScrollScrubCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  intro?: ReactNode;
  className?: string;
};

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export function ScrollScrubCarousel<T>({
  items,
  getKey,
  renderItem,
  intro,
  className,
}: ScrollScrubCarouselProps<T>) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (count < 1) return;
      const next = wrapIndex(index, count);
      setDirection(next > activeIndex ? 1 : next < activeIndex ? -1 : direction);
      setActiveIndex(next);
    },
    [activeIndex, count, direction]
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!section || !pin || prefersReducedMotion() || isMobile() || count < 2) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max((count - 1) * window.innerHeight * 0.55, window.innerHeight * 0.45)}`,
        pin,
        pinSpacing: true,
        scrub: 0.45,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(count - 1, Math.round(self.progress * (count - 1)));
          setActiveIndex((prev) => {
            if (next !== prev) setDirection(next > prev ? 1 : -1);
            return next;
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [count, locale] }
  );

  if (count === 0) return null;

  if (reducedMotion || isMobile() || count < 2) {
    return (
      <div className={className}>
        {intro}
        <ClickCarousel3D items={items} getKey={getKey} renderItem={renderItem} />
      </div>
    );
  }

  const activeItem = items[activeIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: (isRtl ? -dir : dir) * 80,
      opacity: 0,
      rotateY: (isRtl ? -dir : dir) * 12,
      scale: 0.92,
    }),
    center: { x: 0, opacity: 1, rotateY: 0, scale: 1 },
    exit: (dir: number) => ({
      x: (isRtl ? dir : -dir) * 80,
      opacity: 0,
      rotateY: (isRtl ? dir : -dir) * 12,
      scale: 0.92,
    }),
  };

  return (
    <div ref={sectionRef} className={cn("scroll-chapter w-full", className)}>
      <div ref={pinRef} className="chrome-pin-safe chrome-pin-safe--viewport w-full">
        <div className="chrome-pin-safe__inner mx-auto flex w-full max-w-6xl flex-col px-4 md:px-8">
          {intro}

          <div
            data-carousel-root
            className="relative isolate w-full"
            onPointerDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            <div
              className="card-3d-stage relative mx-auto w-full max-w-md sm:max-w-lg"
              style={{ perspective: "var(--perspective-3d)" }}
            >
              <AnimatePresence mode="popLayout" custom={direction}>
                <motion.div
                  key={getKey(activeItem, activeIndex)}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                  className="card-3d-item--active absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="w-full px-2 sm:px-0">
                    {renderItem(activeItem, activeIndex, true)}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex items-center justify-center gap-4 sm:mt-6">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                aria-label="Previous slide"
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-border bg-white shadow-volumetric transition-colors hover:bg-brand-surface-elevated"
              >
                <ChevronLeft className={cn("h-5 w-5", isRtl && "rotate-180")} />
              </button>

              <div className="flex items-center gap-2" aria-live="polite">
                {items.map((item, i) => (
                  <button
                    key={getKey(item, i)}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-2 cursor-pointer rounded-full transition-[width,background-color] duration-300",
                      i === activeIndex
                        ? "w-8 bg-brand-accent"
                        : "w-2 bg-brand-border hover:bg-brand-muted"
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                aria-label="Next slide"
                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-border bg-white shadow-volumetric transition-colors hover:bg-brand-surface-elevated"
              >
                <ChevronRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
