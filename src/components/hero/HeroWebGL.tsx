"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useState } from "react";
import { CreativeFrame } from "@/components/motion/CreativeFrame";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () => import("./HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

type HeroWebGLProps = {
  src: string;
  alt: string;
  floats?: string[];
  role: Role;
  priority?: boolean;
  className?: string;
};

function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function HeroWebGL({
  src,
  alt,
  floats,
  role,
  priority,
  className,
}: HeroWebGLProps) {
  const reducedMotion = useReducedMotion();
  const [webglOk] = useState(() => detectWebGL());
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouse({ x, y });
  }, []);

  const onPointerLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  if (!webglOk || reducedMotion) {
    return (
      <CreativeFrame
        key={role}
        src={src}
        alt={alt}
        floats={floats}
        role={role}
        priority={priority}
        entrance="throw"
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-h-[min(72vw,480px)] overflow-hidden rounded-3xl",
        "bg-gradient-to-b from-brand-surface-elevated to-white shadow-volumetric-lg",
        className
      )}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ perspective: "var(--perspective-3d)" }}
    >
      <Suspense
        fallback={
          <CreativeFrame
            src={src}
            alt={alt}
            floats={floats}
            role={role}
            priority={priority}
            entrance="throw"
          />
        }
      >
        <div className="absolute inset-0">
          <HeroScene src={src} mouseX={mouse.x} mouseY={mouse.y} />
        </div>
      </Suspense>
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, rgba(255,205,87,0.25) 0%, transparent 65%)",
        }}
        aria-hidden
      />
    </div>
  );
}
