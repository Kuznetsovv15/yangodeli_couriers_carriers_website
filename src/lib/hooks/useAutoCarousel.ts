"use client";

import { useEffect, useState } from "react";
import { CAROUSEL_SLIDE_MS } from "@/lib/carousel-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function useAutoCarousel(
  itemCount: number,
  intervalMs = CAROUSEL_SLIDE_MS,
  paused = false
) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion || paused || itemCount < 2) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % itemCount);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [itemCount, intervalMs, paused, reducedMotion]);

  return { activeIndex, setActiveIndex };
}
