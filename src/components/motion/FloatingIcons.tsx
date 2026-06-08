"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export type FloatingIconConfig = {
  id: string;
  type: "lucide" | "image";
  icon?: LucideIcon;
  src?: string;
  className?: string;
  speed?: number;
  size?: number;
  rotateRange?: [number, number];
  opacityRange?: [number, number];
};

type FloatingIconsProps = {
  icons: FloatingIconConfig[];
  className?: string;
};

function FloatingIconItem({
  config,
  scrollYProgress,
  reducedMotion,
}: {
  config: FloatingIconConfig;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reducedMotion: boolean;
}) {
  const speed = config.speed ?? 0.5;
  const rotateRange = config.rotateRange ?? [-12, 12];
  const opacityRange = config.opacityRange ?? [0.25, 0.7];
  const size = config.size ?? 32;

  const y = useTransform(scrollYProgress, [0, 1], [speed * -60, speed * 60]);
  const rotate = useTransform(scrollYProgress, [0, 1], rotateRange);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [
    opacityRange[0],
    opacityRange[1],
    opacityRange[0],
  ]);

  const style = reducedMotion
    ? { opacity: (opacityRange[0] + opacityRange[1]) / 2 }
    : { y, rotate, opacity };

  const Icon = config.icon;

  return (
    <motion.div
      className={cn("pointer-events-none absolute", config.className)}
      style={style}
      aria-hidden
    >
      {config.type === "lucide" && Icon ? (
        <Icon className="text-brand-primary/35" style={{ width: size, height: size }} />
      ) : config.src ? (
        <Image src={config.src} alt="" width={size} height={size} className="opacity-55" />
      ) : null}
    </motion.div>
  );
}

export function FloatingIcons({ icons, className }: FloatingIconsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {icons.map((icon) => (
        <FloatingIconItem
          key={icon.id}
          config={icon}
          scrollYProgress={scrollYProgress}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
