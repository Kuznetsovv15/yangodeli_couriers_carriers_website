"use client";

import { type CSSProperties, type ReactNode } from "react";
import { useLocale } from "next-intl";
import { CAROUSEL_SLIDE_MS } from "@/lib/carousel-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type FlowMarqueeProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  getKey: (item: T, index: number) => string;
  className?: string;
  trackClassName?: string;
  gap?: string;
  slideMs?: number;
  pauseOnHover?: boolean;
};

export function FlowMarquee<T>({
  items,
  renderItem,
  getKey,
  className,
  trackClassName,
  gap = "gap-6",
  slideMs = CAROUSEL_SLIDE_MS,
  pauseOnHover = false,
}: FlowMarqueeProps<T>) {
  const reducedMotion = useReducedMotion();
  const locale = useLocale();
  const isRtl = locale === "he";
  const count = Math.max(items.length, 1);
  const durationMs = count * slideMs;
  const loop = [...items, ...items];

  if (items.length === 0) return null;

  if (reducedMotion) {
    return (
      <div className={cn("overflow-x-auto py-2", className)}>
        <div className={cn("flex w-max px-4", gap)}>
          {items.map((item, i) => (
            <div key={getKey(item, i)} className="shrink-0">
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flow-marquee overflow-hidden py-2",
        pauseOnHover && "flow-marquee--pausable",
        className
      )}
    >
      <div
        className={cn(
          "flow-marquee__track flex w-max px-4",
          gap,
          isRtl ? "flow-marquee__track--rtl" : "flow-marquee__track--ltr",
          trackClassName
        )}
        style={{ "--flow-duration": `${durationMs}ms` } as CSSProperties}
      >
        {loop.map((item, i) => (
          <div key={`${getKey(item, i % items.length)}-loop-${i}`} className="shrink-0">
            {renderItem(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}
