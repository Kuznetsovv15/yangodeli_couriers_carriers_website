"use client";

import { YangoButton } from "@/components/ui/YangoButton";

type MiniCtaProps = {
  label: string;
  onClick: () => void;
};

export function MiniCta({ label, onClick }: MiniCtaProps) {
  return (
    <div className="mt-8 flex justify-center md:justify-start">
      <YangoButton variant="accent" onClick={onClick}>
        {label}
      </YangoButton>
    </div>
  );
}
