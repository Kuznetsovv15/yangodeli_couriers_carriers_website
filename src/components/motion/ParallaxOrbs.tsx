"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type OrbConfig = {
  className: string;
  speed?: number;
  color: string;
};

const defaultOrbs: OrbConfig[] = [
  { className: "top-[8%] start-[4%] h-64 w-64", speed: 0.15, color: "rgba(255, 205, 87, 0.14)" },
  { className: "top-[35%] end-[6%] h-72 w-72", speed: 0.25, color: "rgba(255, 205, 87, 0.08)" },
  { className: "bottom-[8%] start-[25%] h-56 w-56", speed: 0.2, color: "rgba(10, 10, 10, 0.04)" },
];

function ParallaxOrb({
  orb,
  scrollYProgress,
  reducedMotion,
}: {
  orb: OrbConfig;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const speed = orb.speed ?? 0.2;
  const y = useTransform(scrollYProgress, [0, 1], [speed * -50, speed * 50]);

  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl", orb.className)}
      style={{
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        ...(reducedMotion ? {} : { y }),
      }}
      aria-hidden
    />
  );
}

export function ParallaxOrbs({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {defaultOrbs.map((orb, i) => (
        <ParallaxOrb
          key={i}
          orb={orb}
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
