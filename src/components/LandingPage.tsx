"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { LandingPageRoleSync } from "@/components/LandingPageRoleSync";
import { VolumetricChrome } from "@/components/layout/VolumetricChrome";
import { ApplyModal } from "@/components/modals/ApplyModal";
import { Hero } from "@/components/sections/Hero";
import { MissionSplit } from "@/components/sections/MissionSplit";
import { TrustList } from "@/components/sections/TrustList";
import { Benefits } from "@/components/sections/Benefits";
import { FeaturePinCard, FeaturesIntro } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { JourneyCta } from "@/components/sections/JourneyCta";
import { Footer } from "@/components/layout/Footer";
import { APPLY_REQUEST_EVENT, publishCtaPromptContent } from "@/lib/apply-bridge";
import { HorizontalPinSection } from "@/components/motion/HorizontalPinSection";
import { PinnedChapter } from "@/components/motion/PinnedChapter";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ScrollSpreadSection } from "@/components/motion/ScrollSpreadSection";
import { SectionNav } from "@/components/motion/SectionNav";
import { SectionShell } from "@/components/motion/SectionShell";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { resolveCarouselImage, resolveHeroImage } from "@/lib/hero-images";
import type { Role } from "@/types/role";

const SECTION_IDS = [
  "hero",
  "mission",
  "trust",
  "benefits",
  "features",
  "how-it-works",
  "cta",
  "footer",
] as const;

type RoleContent = {
  hero: {
    title: string;
    subtitle: string;
    highlights?: string[];
    cta: string;
    image: string;
  };
  mission?: {
    label?: string;
    body: string;
    highlights?: string[];
    perks?: Array<{ title: string; description: string; sticker: string }>;
  };
  trust?: {
    label?: string;
    subtitle?: string;
    points: Array<{ title: string; description: string }>;
  };
  benefits: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; icon?: string }>;
  };
  whyJoin: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; image?: string }>;
  };
  howItWorks: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; icon?: string }>;
  };
  cta: { title: string; subtitle?: string; button: string };
};

type HeroPanelProps = {
  title: string;
  subtitle: string;
  highlights?: string[];
  cta: string;
  image: string;
  role: Role;
  onCtaClick: () => void;
};

function HeroPanel({
  title,
  subtitle,
  highlights,
  cta,
  image,
  role,
  onCtaClick,
}: HeroPanelProps) {
  const { scrollTo } = useSmoothScroll();

  return (
    <Hero
      title={title}
      subtitle={subtitle}
      highlights={highlights}
      cta={cta}
      image={image}
      role={role}
      onCtaClick={onCtaClick}
      onLearnMore={() => scrollTo("benefits")}
    />
  );
}

export function LandingPage() {
  const t = useTranslations("roles");
  const tLanding = useTranslations("landing");
  const tCommon = useTranslations("common");
  const [selectedRole, setSelectedRole] = useState<Role>("pickers");
  const [applyOpen, setApplyOpen] = useState(false);
  const activeRole = selectedRole;

  const openApply = useCallback(() => setApplyOpen(true), []);

  const role = t.raw(activeRole) as RoleContent;

  const trustPoints =
    role.trust?.points ??
    [
      ...role.benefits.items.map((b) => ({ title: b.title, description: b.description })),
      ...role.howItWorks.items.map((s) => ({ title: s.title, description: s.description })),
    ].slice(0, 4);

  const featureItems = role.whyJoin.items.map((item, i) => ({
    ...item,
    image: item.image ? resolveCarouselImage(activeRole, item.image, i) : item.image,
  }));

  const missionBody = role.mission?.body ?? role.hero.subtitle;

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
      <VolumetricChrome
        header={
          <Header
            activeRole={activeRole}
            onRoleChange={setSelectedRole}
            onApplyClick={openApply}
          />
        }
      />
      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} role={activeRole} />

      <ScrollProgress />
      <SectionNav sectionIds={[...SECTION_IDS]} />

      <main id="main-content" className="chrome-offset relative">
        <SectionShell
          id="hero"
          theme="hero"
          className="min-h-[calc(100dvh-var(--chrome-height-effective,var(--chrome-height)))]"
        >
          <HeroPanel
            title={role.hero.title}
            subtitle={role.hero.subtitle}
            highlights={role.hero.highlights}
            cta={role.hero.cta}
            image={resolveHeroImage(activeRole, role.hero.image)}
            role={activeRole}
            onCtaClick={openApply}
          />
        </SectionShell>

        <PinnedChapter id="mission" className="bg-brand-surface">
          <MissionSplit
            label={role.mission?.label ?? tLanding("missionLabel")}
            line1={role.benefits.title}
            line2={role.whyJoin.title}
            body={missionBody}
            perks={role.mission?.perks}
            highlights={role.mission?.highlights}
            role={activeRole}
            image={resolveHeroImage(activeRole, role.hero.image)}
          />
        </PinnedChapter>

        <SectionShell id="trust" theme="benefits" className="py-16 md:py-28">
          <TrustList
            label={role.trust?.label ?? tLanding("trust.label")}
            title={tLanding("trust.title")}
            subtitle={role.trust?.subtitle ?? tLanding("trust.subtitle")}
            points={trustPoints}
          />
        </SectionShell>

        <ScrollSpreadSection id="benefits" pin spread pinDuration="+=90%">
          <SectionShell theme="benefits" className="w-full py-8 md:py-10">
            <Benefits
              label={role.benefits.label}
              title={role.benefits.title}
              subtitle={role.benefits.subtitle}
              items={role.benefits.items}
              applyLabel={tCommon("apply")}
              onApply={openApply}
            />
          </SectionShell>
        </ScrollSpreadSection>

        <HorizontalPinSection
          id="features"
          className="bg-[var(--theme-features-bg)]"
          intro={
            <FeaturesIntro
              label={role.whyJoin.label}
              title={role.whyJoin.title}
              subtitle={role.whyJoin.subtitle}
            />
          }
          panels={featureItems.map((item, i) => (
            <FeaturePinCard key={item.title} item={item} index={i} />
          ))}
        />

        <PinnedChapter id="how-it-works" className="bg-[var(--theme-steps-bg)]" pinDuration="+=100%">
          <SectionShell theme="steps" className="w-full py-10 md:py-14">
            <HowItWorks
              label={role.howItWorks.label}
              title={role.howItWorks.title}
              subtitle={role.howItWorks.subtitle}
              items={role.howItWorks.items}
            />
          </SectionShell>
        </PinnedChapter>

        <SectionShell id="cta" theme="cta" className="py-16 md:py-24">
          <JourneyCta
            title={role.cta.title}
            subtitle={role.cta.subtitle}
            role={activeRole}
          />
        </SectionShell>

        <footer id="footer">
          <Footer />
        </footer>
      </main>
    </>
  );
}
