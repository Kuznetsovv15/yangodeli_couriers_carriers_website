import type { Role } from "@/types/role";

/** WordPress careers — שליחים hero */
const COURIERS_HERO = "/images/RBCO_Yango_082-1.png";

const ROLE_HERO: Partial<Record<Role, string>> = {
  couriers: COURIERS_HERO,
};

/** WordPress careers heroes */
const PICKERS_HERO = "/images/ChatGPT-Image-Jan-13-2026-06_43_03-PM-1-1.png";
const MANAGER_HERO = "/images/2026-06-07-23.32.50.png";

const LEGACY_HERO: Record<string, string> = {
  "/images/Backpack_On_Phone.png": COURIERS_HERO,
  "/images/RBCO_Yango_082-1.png": COURIERS_HERO,
};

const COURIER_CAROUSEL = [
  "/images/brand/bag-3d.png",
  "/images/hq/courier-slide-1.png",
  "/images/hq/courier-slide-2.png",
  "/images/hq/courier-slide-3.png",
];

const LEGACY_CAROUSEL: Record<string, string> = {
  "/images/Group-2087327956-1-1.png": COURIER_CAROUSEL[0],
  "/images/Group-2087327955-1.png": COURIER_CAROUSEL[1],
  "/images/Group-2087327983.png": COURIER_CAROUSEL[2],
};

const LOW_RES_PREFIXES = ["/images/Group-208732"];

function isLowResPath(path: string): boolean {
  return LOW_RES_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export function resolveHeroImage(role: Role, image: string): string {
  if (role === "pickers") return PICKERS_HERO;
  if (role === "manager") return MANAGER_HERO;
  return ROLE_HERO[role] ?? LEGACY_HERO[image] ?? image;
}

export function resolveCarouselImage(role: Role, image: string, index: number): string {
  if (role === "couriers") {
    if (LEGACY_CAROUSEL[image]) return LEGACY_CAROUSEL[image];
    if (isLowResPath(image)) return COURIER_CAROUSEL[index % COURIER_CAROUSEL.length];
  }
  if (isLowResPath(image) || image.includes("Backpack_On_Phone")) {
    return `/images/brand/illustrations/illustratration${164 + (index % 8) * 2}.png`;
  }
  return image;
}

/** @deprecated use resolveHeroImage */
export { resolveHeroImage as default };
