/** Curated brand illustrations from public/brand/Illustration */
export const BRAND_ILLUSTRATIONS = [
  "/images/brand/illustrations/illustratration164.png",
  "/images/brand/illustrations/illustratration166.png",
  "/images/brand/illustrations/illustratration168.png",
  "/images/brand/illustrations/illustratration170.png",
  "/images/brand/illustrations/illustratration172.png",
  "/images/brand/illustrations/illustratration174.png",
  "/images/brand/illustrations/illustratration176.png",
  "/images/brand/illustrations/illustratration178.png",
] as const;

export function pickIllustration(index: number): string {
  return BRAND_ILLUSTRATIONS[index % BRAND_ILLUSTRATIONS.length];
}
