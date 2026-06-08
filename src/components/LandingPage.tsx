"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { LandingPageRoleSync } from "@/components/LandingPageRoleSync";
import { PromoBar } from "@/components/layout/PromoBar";
import { VolumetricChrome } from "@/components/layout/VolumetricChrome";
import { ApplyModal } from "@/components/modals/ApplyModal";
import { Hero } from "@/components/sections/Hero";
import { MissionSplit } from "@/components/sections/MissionSplit";
import { ServiceTicker } from "@/components/sections/ServiceTicker";
import { TrustList } from "@/components/sections/TrustList";
import { Benefits } from "@/components/sections/Benefits";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { Footer } from "@/components/layout/Footer";
import { APPLY_REQUEST_EVENT, publishCtaPromptContent } from "@/lib/apply-bridge";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { SectionShell } from "@/components/motion/SectionShell";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { resolveCarouselImage, resolveHeroImage } from "@/lib/hero-images";
import type { Role } from "@/types/role";

export function LandingPage() {
  const t = useTranslations("roles");
  const [selectedRole, setSelectedRole] = useState<Role>("pickers");
  const [applyOpen, setApplyOpen] = useState(false);
  const activeRole = selectedRole;
  const { scrollTo } = useSmoothScroll();

  const openApply = useCallback(() => setApplyOpen(true), []);
  const scrollToForm = useCallback(() => scrollTo("contact-form"), [scrollTo]);
  const scrollToBenefits = useCallback(() => scrollTo("benefits"), [scrollTo]);

  const role = t.raw(activeRole) as {
    hero: { title: string; subtitle: string; cta: string; image: string };
    benefits: { title: string; items: Array<{ title: string; description: string; icon?: string }> };
    whyJoin: { title: string; items: Array<{ title: string; description: string; image?: string }> };
    howItWorks: { title: string; items: Array<{ title: string; description: string; icon?: string }> };
    form: { title: string };
    cta: { title: string; button: string };
  };

  const trustItems = [
    ...role.benefits.items.map((b) => b.title),
    ...role.howItWorks.items.map((s) => s.title),
  ].slice(0, 6);

  useEffect(() => {
    publishCtaPromptContent({
      title: role.cta.title,
      button: role.cta.button,
    });
  }, [role.cta.title, role.cta.button]);

  useEffect(() => {
    const onApplyRequest = () => setApplyOpen(true);
    window.addEventListener(APPLY_REQUEST_EVENT, onApplyRequest);
    return () => window.removeEventListener(APPLY_REQUEST_EVENT, onApplyRequest);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <LandingPageRoleSync onRoleFromUrl={setSelectedRole} />
      </Suspense>
      <ScrollProgress />
      <VolumetricChrome
        promo={<PromoBar />}
        header={
          <Header
            activeRole={activeRole}
            onRoleChange={setSelectedRole}
            onApplyClick={openApply}
          />
        }
      />
      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} role={activeRole} />

      <main className="chrome-offset">
        <SectionShell id="hero" theme="hero">
          <Hero
            title={role.hero.title}
            subtitle={role.hero.subtitle}
            cta={role.hero.cta}
            image={resolveHeroImage(activeRole, role.hero.image)}
            role={activeRole}
            onCtaClick={openApply}
            onLearnMore={scrollToBenefits}
          />
        </SectionShell>

        <ServiceTicker />

        <MissionSplit
          line1={role.benefits.title}
          line2={role.whyJoin.title}
          body={role.hero.subtitle}
        />

        <TrustList title={role.howItWorks.title} items={trustItems} />

        <SectionShell id="benefits" theme="benefits">
          <Benefits title={role.benefits.title} items={role.benefits.items} />
        </SectionShell>

        <SectionShell id="features" theme="features">
          <Features
            title={role.whyJoin.title}
            role={activeRole}
            items={role.whyJoin.items.map((item, i) => ({
              ...item,
              image: item.image
                ? resolveCarouselImage(activeRole, item.image, i)
                : item.image,
            }))}
          />
        </SectionShell>

        <SectionShell id="how-it-works" theme="steps">
          <HowItWorks title={role.howItWorks.title} items={role.howItWorks.items} />
        </SectionShell>

        <SectionShell id="contact-form" theme="form">
          <ContactFormSection title={role.form.title} role={activeRole} />
        </SectionShell>
      </main>
      <Footer />
    </>
  );
}
