"use client";

import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ExpandablePanel } from "@/components/motion/ExpandablePanel";
import { LiveIcon } from "@/components/motion/LiveIcon";
import { TextReveal } from "@/components/motion/TextReveal";
import { BOX_CREATIVES } from "@/lib/brand-assets";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/motion-utils";

type BenefitItem = {
  title: string;
  description: string;
  icon?: string;
};

type BenefitsProps = {
  title: string;
  items: BenefitItem[];
};

export function Benefits({ title, items }: BenefitsProps) {
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
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef, dependencies: [items.length] }
  );

  return (
    <section ref={sectionRef} className="relative px-4 py-12 sm:py-16 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <TextReveal className="mb-6">
            <h2 className="font-heading text-section font-black text-brand-text">{title}</h2>
          </TextReveal>
          <div className="mt-10 hidden gap-3 lg:grid lg:grid-cols-2">
            {BOX_CREATIVES.slice(0, 4).map((src, i) => (
              <div
                key={src}
                className="volumetric-card overflow-hidden rounded-2xl bg-brand-surface-elevated p-4 transition-transform duration-500 hover:-translate-y-1"
                style={{ transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
              >
                <Image
                  src={src}
                  alt=""
                  width={160}
                  height={160}
                  className="mx-auto h-28 w-28 object-contain"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>

        <div ref={panelRef}>
          <ExpandablePanel
            items={items.map((item, i) => ({
              id: item.title,
              title: item.title,
              description: item.description,
              icon: item.icon ? <LiveIcon src={item.icon} alt="" /> : undefined,
              accent: (
                <div className="mb-4 overflow-hidden rounded-xl bg-brand-surface-elevated p-3">
                  <Image
                    src={BOX_CREATIVES[i % BOX_CREATIVES.length]}
                    alt=""
                    width={80}
                    height={80}
                    className="h-16 w-16 object-contain"
                    aria-hidden
                  />
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}
