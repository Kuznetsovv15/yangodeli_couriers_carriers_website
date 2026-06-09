"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ClickCarousel3D } from "@/components/motion/ClickCarousel3D";
import { MiniCta } from "@/components/ui/MiniCta";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { isProductImage } from "@/lib/brand-assets";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

export type FeatureItem = {
  title: string;
  description: string;
  image?: string;
};

type FeaturesProps = {
  title: string;
  items: FeatureItem[];
  role?: Role;
  applyLabel?: string;
  onApply?: () => void;
};

export function FeaturesIntro({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <SectionIntro
      label={label}
      title={title}
      subtitle={subtitle}
      align="start"
      size="large"
      className="mb-0"
    />
  );
}

export function FeaturePinCard({ item, index }: { item: FeatureItem; index: number }) {
  return (
    <article className="card-3d volumetric-card flex h-full flex-col overflow-hidden rounded-2xl bg-white sm:rounded-3xl">
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
            className={isProductImage(item.image) ? "object-contain p-2" : "object-cover"}
            sizes="(max-width: 768px) 100vw, 52vw"
            quality={isProductImage(item.image) ? 100 : 90}
          />
        </div>
      )}
      <div className="space-y-3 p-6">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-black text-brand-primary">
          {index + 1}
        </span>
        <h3 className="font-heading text-xl font-bold text-brand-text md:text-2xl">{item.title}</h3>
        <p className="text-sm leading-relaxed text-brand-muted md:text-base">{item.description}</p>
      </div>
    </article>
  );
}

export function Features({ title, items, applyLabel, onApply }: FeaturesProps) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
      <h2 className="mb-8 text-center font-heading text-section font-black text-brand-text md:mb-10 md:text-start">
        {title}
      </h2>

      <ClickCarousel3D
        items={items}
        getKey={(item) => item.title}
        renderItem={(item, index) => (
          <motion.article
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="card-3d volumetric-card w-full overflow-hidden rounded-2xl bg-white transition-[box-shadow] duration-300 hover:shadow-volumetric-lg sm:rounded-3xl"
          >
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
                    isProductImage(item.image) ? "object-contain p-2" : "object-cover"
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
          </motion.article>
        )}
      />

      {applyLabel && onApply && <MiniCta label={applyLabel} onClick={onApply} />}
    </div>
  );
}
