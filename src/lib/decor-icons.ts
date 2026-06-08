import type { FlyDirection } from "@/components/motion/FlyIn";

export type DecorIcon = {
  id: string;
  src: string;
  from: FlyDirection;
  className: string;
  size: number;
  delay?: number;
};

export const HERO_DECOR: DecorIcon[] = [
  { id: "coin-1", src: "/icons/icon1.svg", from: "top", className: "top-[14%] start-[6%]", size: 44, delay: 0.1 },
  { id: "coin-2", src: "/icons/icon1.svg", from: "right", className: "top-[28%] end-[8%]", size: 36, delay: 0.2 },
  { id: "prod-1", src: "/icons/icon2.svg", from: "left", className: "bottom-[30%] start-[4%]", size: 40, delay: 0.15 },
  { id: "prod-2", src: "/icons/icon3.svg", from: "bottom", className: "bottom-[18%] end-[10%]", size: 38, delay: 0.25 },
];

export const BENEFITS_DECOR: DecorIcon[] = [
  { id: "b-coin", src: "/icons/icon1.svg", from: "top", className: "top-[8%] end-[5%]", size: 42 },
  { id: "b-icon", src: "/icons/icon4.svg", from: "left", className: "bottom-[15%] start-[3%]", size: 36 },
];

export const FEATURES_DECOR: DecorIcon[] = [
  { id: "f-coin", src: "/icons/icon1.svg", from: "right", className: "top-[10%] start-[4%]", size: 40 },
  { id: "f-prod", src: "/icons/picking-orders.svg", from: "top", className: "bottom-[12%] end-[6%]", size: 44 },
];

export const STEPS_DECOR: DecorIcon[] = [
  { id: "s-coin", src: "/icons/icon1.svg", from: "left", className: "top-[12%] end-[8%]", size: 38 },
  { id: "s-pay", src: "/icons/icon2.svg", from: "bottom", className: "bottom-[10%] start-[5%]", size: 40 },
];

export const FORM_DECOR: DecorIcon[] = [
  { id: "form-coin", src: "/icons/icon1.svg", from: "top", className: "top-[15%] start-[8%]", size: 36 },
  { id: "form-icon", src: "/icons/Flexible-shifts.svg", from: "right", className: "bottom-[20%] end-[6%]", size: 42 },
];
