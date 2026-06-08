"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ExpandablePanel } from "@/components/motion/ExpandablePanel";
import { LiveIcon } from "@/components/motion/LiveIcon";
import { TextReveal } from "@/components/motion/TextReveal";
import { BAG_3D, BOX_CREATIVES } from "@/lib/brand-assets";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

type StepItem = {
  title: string;
  description: string;
  icon?: string;
};

type HowItWorksProps = {
  title: string;
  items: StepItem[];
};

export function HowItWorks({ title, items }: HowItWorksProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !panelRef.current) return;

      gsap.from(panelRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  return (
    <section ref={sectionRef} className="relative px-4 py-12 sm:py-16 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <TextReveal>
              <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
            </TextReveal>
          </div>
          <div className="volumetric-card hidden overflow-hidden rounded-2xl bg-brand-surface-elevated p-4 lg:block">
            <Image src={BAG_3D} alt="" width={100} height={100} className="h-24 w-24 object-contain" />
          </div>
        </div>

        <div ref={panelRef} className="max-w-3xl">
          <ExpandablePanel
            items={items.map((item, i) => ({
              id: item.title,
              title: `${i + 1}. ${item.title}`,
              description: item.description,
              icon: item.icon ? <LiveIcon src={item.icon} alt="" size={40} /> : undefined,
              accent: (
                <div className="mb-3 flex items-center gap-3">
                  <Image
                    src={BOX_CREATIVES[i % BOX_CREATIVES.length]}
                    alt=""
                    width={64}
                    height={64}
                    className="h-14 w-14 object-contain"
                    aria-hidden
                  />
                  <span className="text-xs font-semibold uppercase tracking-widest text-brand-accent-dark">
                    Step {i + 1}
                  </span>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
