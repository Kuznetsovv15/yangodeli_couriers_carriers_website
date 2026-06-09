"use client";

import { useScrollJourney } from "@/components/motion/ScrollJourney";

export function ScrollJourneyProgress() {
  const { activeIndex, total } = useScrollJourney();
  if (total <= 1) return null;

  const progress = (activeIndex + 1) / total;

  return (
    <div
      className="fixed inset-x-0 z-[100] h-0.5"
      style={{ top: "var(--chrome-height-effective, var(--chrome-height))" }}
    >
      <div
        className="h-full origin-left bg-brand-accent transition-transform duration-500 ease-out"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />
    </div>
  );
}
