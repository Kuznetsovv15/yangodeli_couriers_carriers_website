"use client";

import Image from "next/image";
import { CreativeFrame } from "@/components/motion/CreativeFrame";
import { ScrollSwapLines } from "@/components/motion/ScrollSwapLines";
import { SectionMesh } from "@/components/motion/SectionMesh";
import { TextReveal } from "@/components/motion/TextReveal";
import { getMissionFloats } from "@/lib/brand-assets";
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
  pinDuration?: string;
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
  pinDuration = "+=65%",
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
    <section className="mission-split relative w-full overflow-hidden border-y border-brand-border bg-brand-surface px-4 py-10 sm:py-12 md:px-6 md:py-6 lg:px-8 lg:py-4">
      <SectionMesh variant="warm" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-10">
        <div className="flex min-w-0 flex-col gap-4 text-center lg:gap-3 lg:text-start">
          {label && (
            <p className="text-eyebrow font-bold uppercase tracking-[0.14em] text-brand-text/75">
              {label}
            </p>
          )}
          <ScrollSwapLines
            lines={[line1, line2]}
            triggerId="mission"
            accentIndex={1}
            pinDuration={pinDuration}
          />
          <TextReveal delay={0.12} className="mx-auto max-w-2xl lg:mx-0">
            <p className="font-sans text-lead leading-snug text-brand-muted md:text-[1.05rem] md:leading-relaxed lg:line-clamp-3">
              {body}
            </p>
          </TextReveal>

          {displayPerks.length > 0 && (
            <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {displayPerks.map((perk) => (
                <li
                  key={perk.title}
                  className={cn(
                    "volumetric-card flex items-start gap-2.5 rounded-xl border border-brand-border/60",
                    "bg-white/90 p-3 text-start shadow-sm sm:gap-3 sm:p-3.5"
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-surface-warm p-1.5 sm:h-11 sm:w-11">
                    <Image
                      src={perk.sticker}
                      alt=""
                      width={36}
                      height={36}
                      className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-sm font-bold leading-tight text-brand-text sm:text-[0.9375rem]">
                      {perk.title}
                    </h3>
                    {perk.description && (
                      <p className="mt-0.5 font-sans text-xs leading-snug text-brand-muted sm:text-[0.8125rem] sm:leading-relaxed lg:line-clamp-2">
                        {perk.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto w-full max-w-[220px] shrink-0 lg:mx-0 lg:max-w-none">
          <CreativeFrame
            src={image}
            alt=""
            floats={getMissionFloats(role)}
            role={role}
            entrance="none"
            size="compact"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
