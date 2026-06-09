"use client";

import { SectionIntro } from "@/components/ui/SectionIntro";
import { cn } from "@/lib/utils";

type TrustPoint = {
  title: string;
  description: string;
};

type TrustListProps = {
  label?: string;
  title: string;
  subtitle?: string;
  points: TrustPoint[];
};

export function TrustList({ label, title, subtitle, points }: TrustListProps) {
  const columnClass =
    points.length >= 4
      ? "sm:grid-cols-2 xl:grid-cols-4"
      : points.length === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <SectionIntro
        label={label}
        title={title}
        subtitle={subtitle}
        size="large"
        className="mb-10 md:mb-14"
      />

      <div className={cn("grid grid-cols-1 gap-4 md:gap-5", columnClass)}>
        {points.map((item, i) => (
          <article
            key={item.title}
            className={cn(
              "volumetric-card rounded-2xl bg-brand-surface p-6 sm:p-7",
              "transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-volumetric-lg"
            )}
          >
            <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent font-heading text-sm font-black text-brand-primary">
              {i + 1}
            </span>
            <h3 className="font-heading text-lg font-bold text-brand-text sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-brand-muted md:text-base">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
