"use client";

import Image from "next/image";
import { FlowMarquee } from "@/components/motion/FlowMarquee";
type CreativeMarqueeProps = {
  images: string[];
  className?: string;
};

export function CreativeMarquee({ images, className }: CreativeMarqueeProps) {
  const unique = [...new Set(images)];
  if (unique.length === 0) return null;

  return (
    <FlowMarquee
      items={unique}
      getKey={(src) => src}
      className={className}
      gap="gap-8"
      renderItem={(src) => (
        <div className="volumetric-card overflow-hidden rounded-2xl bg-white p-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-volumetric">
          <Image
            src={src}
            alt=""
            width={180}
            height={180}
            className="h-32 w-32 object-contain md:h-40 md:w-40"
            aria-hidden
          />
        </div>
      )}
    />
  );
}
