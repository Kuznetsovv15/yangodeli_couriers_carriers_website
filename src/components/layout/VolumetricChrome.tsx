"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type VolumetricChromeProps = {
  promo: ReactNode;
  header: ReactNode;
  className?: string;
};

export function VolumetricChrome({ promo, header, className }: VolumetricChromeProps) {
  return (
    <div className={cn("fixed inset-x-0 top-0 z-50 flex justify-center px-2 pt-2 sm:px-3 sm:pt-3 md:px-6", className)}>
      <div className="volumetric-chrome w-full max-w-7xl overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl">
        {promo}
        {header}
      </div>
    </div>
  );
}
