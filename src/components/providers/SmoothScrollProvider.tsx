"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-config";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

type SmoothScrollContextValue = {
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used within SmoothScrollProvider");
  return ctx;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      return;
    }

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    ScrollTrigger.refresh();

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo: SmoothScrollContextValue["scrollTo"] = (target, options) => {
    const el = typeof target === "string" ? document.getElementById(target) : target;
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>{children}</SmoothScrollContext.Provider>
  );
}
