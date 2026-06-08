"use client";

import Image from "next/image";
import { CreativeMarquee } from "@/components/motion/CreativeMarquee";
import { FlowMarquee } from "@/components/motion/FlowMarquee";
import { TextReveal } from "@/components/motion/TextReveal";
import { getMarqueeCreatives, isProductImage } from "@/lib/brand-assets";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

type FeatureItem = {
  title: string;
  description: string;
  image?: string;
};

type FeaturesProps = {
  title: string;
  items: FeatureItem[];
  role: Role;
};

export function Features({ title, items, role }: FeaturesProps) {
  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden px-4 py-12 sm:py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <TextReveal className="mb-10">
          <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
        </TextReveal>

        <FlowMarquee
          items={items}
          getKey={(item) => item.title}
          gap="gap-8"
          className="-mx-4"
          renderItem={(item, index) => (
            <article className="volumetric-card w-[min(92vw,340px)] overflow-hidden rounded-2xl bg-white sm:w-[min(88vw,400px)] sm:rounded-3xl">
              {item.image && (
                <div
                  className={cn(
                    "relative aspect-[4/3] bg-brand-surface-elevated",
                    isProductImage(item.image) && "p-4"
                  )}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={
                      isProductImage(item.image)
                        ? "object-contain p-2"
                        : "object-cover"
                    }
                    sizes="400px"
                    quality={isProductImage(item.image) ? 100 : 90}
                  />
                </div>
              )}
              <div className="space-y-3 p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-black text-brand-primary">
                  {index + 1}
                </span>
                <h3 className="font-heading text-xl font-bold text-brand-text md:text-2xl">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-muted md:text-base">
                  {item.description}
                </p>
              </div>
            </article>
          )}
        />

        <div className="mt-14">
          <CreativeMarquee images={getMarqueeCreatives(role)} />
        </div>
      </div>
    </section>
  );
}
