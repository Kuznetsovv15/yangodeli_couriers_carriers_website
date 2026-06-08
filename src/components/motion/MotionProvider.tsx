"use client";

import { type ReactNode } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
