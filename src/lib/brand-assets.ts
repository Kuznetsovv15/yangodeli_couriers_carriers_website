import type { Role } from "@/types/role";

const YB = "/brand/Illustration/Yellow%20background";

/** Brand box / bag creatives from Yango Deli pack */
export const BOX_CREATIVES = [
  `${YB}/63.png`,
  `${YB}/74.png`,
  `${YB}/81.png`,
  `${YB}/58.png`,
  `${YB}/72.png`,
  `${YB}/49.png`,
  `${YB}/67.png`,
  `${YB}/55.png`,
] as const;

export const BAG_3D = "/images/brand/bag-3d.png";
/** HQ 3D render — 2854×2720, used for Couriers hero */
export const COURIER_BAG = BAG_3D;

export function isProductImage(src: string): boolean {
  return src.includes("bag") || src.includes("courier-bag");
}
export const FIRST_SCREEN = "/images/brand/first-screen.png";

const ILLUSTRATIONS = [
  "/images/brand/illustrations/illustratration164.png",
  "/images/brand/illustrations/illustratration166.png",
  "/images/brand/illustrations/illustratration168.png",
  "/images/brand/illustrations/illustratration170.png",
  "/images/brand/illustrations/illustratration172.png",
  "/images/brand/illustrations/illustratration174.png",
  "/images/brand/illustrations/illustratration176.png",
  "/images/brand/illustrations/illustratration178.png",
] as const;

const ROLE_FLOATS: Record<Role, string[]> = {
  pickers: [BAG_3D, BOX_CREATIVES[0], BOX_CREATIVES[2]],
  couriers: [],
  support: [BOX_CREATIVES[3], ILLUSTRATIONS[2], ILLUSTRATIONS[0]],
  manager: [BOX_CREATIVES[4], ILLUSTRATIONS[4], FIRST_SCREEN],
};

export function getRoleFloats(role: Role): string[] {
  return ROLE_FLOATS[role];
}

export function getMarqueeCreatives(role: Role): string[] {
  const base = [...BOX_CREATIVES, BAG_3D, ...ILLUSTRATIONS];
  if (role === "couriers") {
    return [
      COURIER_BAG,
      "/images/hq/courier-slide-1.png",
      "/images/hq/courier-slide-2.png",
      "/images/hq/courier-slide-3.png",
      ...base.slice(0, 4),
    ];
  }
  return base;
}
