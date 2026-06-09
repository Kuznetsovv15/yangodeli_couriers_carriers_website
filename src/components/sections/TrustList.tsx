"use client";

import { SectionIntro } from "@/components/ui/SectionIntro";
import { cn } from "@/lib/utils";

type TrustPoint = {
  title: string;
  description: string;
};

type TrustStat = {
  value: string | number;
  label: string;
};

type TrustListProps = {
  label?: string;
  title: string;
  subtitle?: string;
  points: TrustPoint[];
  stats?: TrustStat[];
};

export function TrustList({ label, title, subtitle, points, stats }: TrustListProps) {
  const columnClass =
    points.length >= 6
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : points.length >= 4
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
        className="mb-8 md:mb-10"
      />

      {stats && stats.length > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-3 md:mb-10 md:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="volumetric-card rounded-2xl border border-brand-border/50 bg-white/90 px-3 py-4 text-center sm:px-4"
            >
              <p className="font-heading text-2xl font-black text-brand-text md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 font-sans text-[0.65rem] font-semibold uppercase tracking-wide text-brand-muted sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className={cn("grid grid-cols-1 gap-4 md:gap-5", columnClass)}>
        {points.map((item, i) => (
          <article
            key={item.title}
            data-reveal-item
            className={cn(
              "volumetric-card rounded-2xl bg-brand-surface p-5 sm:p-6",
              "transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-volumetric-lg"
            )}
          >
            <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent font-heading text-sm font-black text-brand-primary sm:mb-4 sm:h-10 sm:w-10">
              {i + 1}
            </span>
            <h3 className="font-heading text-base font-bold text-brand-text sm:text-lg md:text-xl">
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
