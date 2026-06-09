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

const HERO_FLOATS: Record<Role, string[]> = {
  pickers: [BAG_3D, BOX_CREATIVES[0], BOX_CREATIVES[2]],
  couriers: [COURIER_BAG, BOX_CREATIVES[1], BOX_CREATIVES[5]],
  support: [BOX_CREATIVES[3], ILLUSTRATIONS[2], ILLUSTRATIONS[0]],
  manager: [BOX_CREATIVES[4], ILLUSTRATIONS[4], FIRST_SCREEN],
};

/** Distinct sticker set for mission block — no overlap with hero floats */
const MISSION_FLOATS: Record<Role, string[]> = {
  pickers: [BOX_CREATIVES[1], ILLUSTRATIONS[1], BOX_CREATIVES[6]],
  couriers: [
    "/images/hq/courier-slide-1.png",
    "/images/hq/courier-slide-3.png",
    BOX_CREATIVES[2],
  ],
  support: [ILLUSTRATIONS[1], ILLUSTRATIONS[3], BOX_CREATIVES[7]],
  manager: [ILLUSTRATIONS[5], ILLUSTRATIONS[7], BOX_CREATIVES[0]],
};

/** Distinct hero images for mission — no overlap with hero section */
const MISSION_IMAGES: Record<Role, string> = {
  pickers: FIRST_SCREEN,
  couriers: "/images/hq/courier-slide-2.png",
  support: "/images/brand/illustrations/illustratration172.png",
  manager: "/images/brand/illustrations/illustratration176.png",
};

export function getRoleFloats(role: Role): string[] {
  return HERO_FLOATS[role];
}

export function getMissionFloats(role: Role): string[] {
  return MISSION_FLOATS[role];
}

export function getMissionImage(role: Role): string {
  return MISSION_IMAGES[role];
}

const ROLE_ORDER: Role[] = ["pickers", "couriers", "support", "manager"];

type DecorPlacement = {
  src: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  rotate: number;
  size: number;
};

const TRANSITION_KEYS = [
  "hero-mission",
  "mission-trust",
  "trust-benefits",
  "benefits-features",
  "features-steps",
  "steps-cta",
] as const;

const TRANSITION_SLOTS: Omit<DecorPlacement, "src">[] = [
  { left: "4%", top: "18%", rotate: -10, size: 52 },
  { left: "20%", top: "58%", rotate: 7, size: 40 },
  { right: "20%", top: "24%", rotate: -6, size: 44 },
  { right: "5%", top: "52%", rotate: 9, size: 48 },
];

const AMBIENT_SLOTS: Record<"mission" | "benefits" | "cta", Omit<DecorPlacement, "src">[]> = {
  mission: [
    { left: "3%", bottom: "12%", rotate: -8, size: 64 },
    { left: "18%", bottom: "28%", rotate: 5, size: 48 },
    { right: "18%", bottom: "18%", rotate: -4, size: 52 },
    { right: "4%", bottom: "8%", rotate: 11, size: 56 },
  ],
  benefits: [
    { left: "5%", bottom: "16%", rotate: 6, size: 50 },
    { right: "6%", bottom: "20%", rotate: -7, size: 46 },
  ],
  cta: [
    { left: "6%", bottom: "22%", rotate: -5, size: 54 },
    { left: "24%", bottom: "10%", rotate: 8, size: 42 },
    { right: "24%", bottom: "14%", rotate: -9, size: 46 },
    { right: "5%", bottom: "24%", rotate: 6, size: 50 },
  ],
};

function pickDecorPool(role: Role): string[] {
  return [...getRoleFloats(role), ...getMissionFloats(role), ...ILLUSTRATIONS, BAG_3D];
}

function pickSrc(pool: string[], index: number, salt: number): string {
  return pool[(index + salt) % pool.length] ?? pool[0];
}

export function getTransitionDecor(
  role: Role,
  variant: (typeof TRANSITION_KEYS)[number]
): DecorPlacement[] {
  const pool = pickDecorPool(role);
  const salt = TRANSITION_KEYS.indexOf(variant) * 2 + ROLE_ORDER.indexOf(role);

  return TRANSITION_SLOTS.map((slot, i) => ({
    ...slot,
    src: pickSrc(pool, i, salt),
  }));
}

export function getAmbientDecor(
  role: Role,
  variant: keyof typeof AMBIENT_SLOTS
): DecorPlacement[] {
  const pool = pickDecorPool(role);
  const salt = variant.length + ROLE_ORDER.indexOf(role) * 3;

  return AMBIENT_SLOTS[variant].map((slot, i) => ({
    ...slot,
    src: pickSrc(pool, i + 2, salt),
  }));
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
