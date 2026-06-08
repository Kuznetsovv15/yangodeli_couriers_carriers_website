"use client";

import { FlowMarquee } from "@/components/motion/FlowMarquee";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

type TrustListProps = {
  title: string;
  items: string[];
};

export function TrustList({ title, items }: TrustListProps) {
  return (
    <section className="bg-brand-surface-elevated px-4 py-12 sm:py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <TextReveal className="mb-10 text-center">
          <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
        </TextReveal>

        <FlowMarquee
          items={items}
          getKey={(item) => item}
          gap="gap-5"
          renderItem={(item, i) => (
            <article
              className={cn(
                "volumetric-card w-[min(85vw,300px)] rounded-2xl bg-white p-6",
                "transition-transform duration-300 hover:-translate-y-1 hover:shadow-volumetric"
              )}
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-sm font-black text-brand-primary">
                {(i % items.length) + 1}
              </span>
              <p className="text-base font-semibold leading-snug text-brand-text">{item}</p>
            </article>
          )}
        />
      </div>
    </section>
  );
}
