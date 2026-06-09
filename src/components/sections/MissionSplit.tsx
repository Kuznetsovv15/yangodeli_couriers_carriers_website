"use client";

import Image from "next/image";
import { CreativeFrame } from "@/components/motion/CreativeFrame";
import { ScrollSwapLines } from "@/components/motion/ScrollSwapLines";
import { SectionMesh } from "@/components/motion/SectionMesh";
import { TextReveal } from "@/components/motion/TextReveal";
import { getRoleFloats } from "@/lib/brand-assets";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";

type MissionPerk = {
  title: string;
  description: string;
  sticker: string;
};

type MissionSplitProps = {
  label?: string;
  line1: string;
  line2: string;
  body: string;
  perks?: MissionPerk[];
  highlights?: string[];
  role: Role;
  image: string;
};

export function MissionSplit({
  label,
  line1,
  line2,
  body,
  perks,
  highlights,
  role,
  image,
}: MissionSplitProps) {
  const displayPerks =
    perks ??
    highlights?.map((item) => ({
      title: item,
      description: "",
      sticker: "/icons/icon2.svg",
    })) ??
    [];

  return (
    <section className="relative overflow-hidden border-y border-brand-border bg-brand-surface px-4 py-14 sm:py-16 md:px-8 md:py-28">
      <SectionMesh variant="warm" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="text-center lg:text-start">
          {label && (
            <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-brand-text/75">
              {label}
            </p>
          )}
          <ScrollSwapLines lines={[line1, line2]} triggerId="mission" accentIndex={1} />
          <TextReveal delay={0.12} className="mx-auto mt-6 max-w-2xl lg:mx-0">
            <p className="font-sans text-lead leading-relaxed text-brand-muted">{body}</p>
          </TextReveal>

          {displayPerks.length > 0 && (
            <ul className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:gap-3.5 lg:mx-0">
              {displayPerks.map((perk) => (
                <li
                  key={perk.title}
                  className={cn(
                    "volumetric-card flex items-start gap-3.5 rounded-2xl border border-brand-border/60",
                    "bg-white/90 p-4 text-start shadow-sm sm:gap-4 sm:p-5"
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-surface-warm p-2 sm:h-14 sm:w-14">
                    <Image
                      src={perk.sticker}
                      alt=""
                      width={44}
                      height={44}
                      className="h-9 w-9 object-contain sm:h-10 sm:w-10"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-base font-bold text-brand-text sm:text-lg">
                      {perk.title}
                    </h3>
                    {perk.description && (
                      <p className="mt-1 font-sans text-sm leading-relaxed text-brand-muted md:text-base">
                        {perk.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
          <CreativeFrame
            src={image}
            alt=""
            floats={getRoleFloats(role)}
            role={role}
            entrance="none"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
