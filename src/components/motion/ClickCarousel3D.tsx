"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { type ReactNode, useCallback, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ClickCarousel3DProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode;
  className?: string;
};

function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

export function ClickCarousel3D<T>({
  items,
  getKey,
  renderItem,
  className,
}: ClickCarousel3DProps<T>) {
  const locale = useLocale();
  const isRtl = locale === "he";
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const count = items.length;

  const goTo = useCallback(
    (index: number) => {
      if (count < 1) return;
      const next = wrapIndex(index, count);
      const forwardSteps = (next - activeIndex + count) % count;
      setDirection(forwardSteps > 0 && forwardSteps <= count / 2 ? 1 : -1);
      setActiveIndex(next);
    },
    [activeIndex, count]
  );

  const goPrev = () => goTo(activeIndex - 1);
  const goNext = () => goTo(activeIndex + 1);

  if (count === 0) return null;

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
    <div
      data-carousel-root
      className={cn("relative isolate w-full", className)}
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
            variants={reducedMotion ? undefined : slideVariants}
            initial={reducedMotion ? false : "enter"}
            animate="center"
            exit={reducedMotion ? undefined : "exit"}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="card-3d-item--active absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="w-full px-2 sm:px-0">{renderItem(activeItem, activeIndex, true)}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4 sm:mt-6">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-border bg-white shadow-volumetric transition-colors hover:bg-brand-surface-elevated"
          >
            <ChevronLeft className={cn("h-5 w-5", isRtl && "rotate-180")} />
          </button>

          <div className="flex items-center gap-2">
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
            onClick={goNext}
            aria-label="Next slide"
            className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-border bg-white shadow-volumetric transition-colors hover:bg-brand-surface-elevated"
          >
            <ChevronRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
          </button>
        </div>
      )}
    </div>
  );
}
