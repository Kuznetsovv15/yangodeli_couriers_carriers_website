"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type ParallaxSectionProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  as?: "section" | "div";
  id?: string;
};

export function ParallaxSection({
  children,
  className,
  speed = 0.3,
  as = "section",
  id,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const ref = as === "section" ? sectionRef : divRef;
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -80, speed * 80]);

  const inner = (
    <motion.div style={reducedMotion ? undefined : { y }}>{children}</motion.div>
  );

  if (as === "div") {
    return (
      <motion.div ref={divRef} id={id} className={cn("relative", className)}>
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.section ref={sectionRef} id={id} className={cn("relative", className)}>
      {inner}
    </motion.section>
  );
}
