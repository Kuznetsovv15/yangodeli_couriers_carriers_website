"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap } from "@/lib/gsap-config";
import type { DecorIcon } from "@/lib/decor-icons";
import { prefersReducedMotion } from "@/lib/motion-utils";
import { cn } from "@/lib/utils";

const flyOffset = {
  left: { x: -70, y: 0 },
  right: { x: 70, y: 0 },
  top: { x: 0, y: -70 },
  bottom: { x: 0, y: 70 },
};

type FloatingDecorProps = {
  items: DecorIcon[];
  className?: string;
};

function DecorItem({ item }: { item: DecorIcon }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const offset = flyOffset[item.from];
      gsap.from(el, {
        x: offset.x,
        y: offset.y,
        opacity: 0,
        rotation: item.from === "top" ? -12 : 0,
        duration: 1,
        delay: item.delay ?? 0,
        ease: item.from === "top" ? "back.out(2)" : "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(el, {
        y: "+=10",
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: (item.delay ?? 0) + 1,
      });
    },
    { dependencies: [item.id] }
  );

  return (
    <div
      ref={ref}
      className={cn(
        "decor-icon pointer-events-none absolute z-0",
        item.className
      )}
      aria-hidden
    >
      <Image
        src={item.src}
        alt=""
        width={item.size}
        height={item.size}
        className="h-auto w-full drop-shadow-sm"
      />
    </div>
  );
}

export function FloatingDecor({ items, className }: FloatingDecorProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {items.map((item) => (
        <DecorItem key={item.id} item={item} />
      ))}
    </div>
  );
}
