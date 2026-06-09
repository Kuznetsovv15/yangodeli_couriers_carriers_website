export type JourneyDirection = "up" | "down" | "left" | "right";

export const JOURNEY_EXIT_DIRECTIONS: JourneyDirection[] = [
  "up",
  "left",
  "right",
  "down",
  "left",
  "right",
  "up",
  "down",
  "left",
];

type JourneyTransform = {
  x: number;
  y: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  opacity: number;
};

const CENTER: JourneyTransform = {
  x: 0,
  y: 0,
  rotateY: 0,
  rotateX: 0,
  scale: 1,
  opacity: 1,
};

function flipHorizontal(dir: JourneyDirection, rtl: boolean): JourneyDirection {
  if (!rtl) return dir;
  if (dir === "left") return "right";
  if (dir === "right") return "left";
  return dir;
}

export function getJourneyExitTransform(
  direction: JourneyDirection,
  rtl = false
): JourneyTransform {
  const dir = flipHorizontal(direction, rtl);

  switch (dir) {
    case "up":
      return { x: 0, y: -120, rotateY: 0, rotateX: 12, scale: 0.82, opacity: 0 };
    case "down":
      return { x: 0, y: 120, rotateY: 0, rotateX: -12, scale: 0.82, opacity: 0 };
    case "left":
      return { x: -140, y: 0, rotateY: 28, rotateX: 0, scale: 0.85, opacity: 0 };
    case "right":
      return { x: 140, y: 0, rotateY: -28, rotateX: 0, scale: 0.85, opacity: 0 };
    default:
      return { ...CENTER, opacity: 0 };
  }
}

export function getJourneyEnterFrom(
  direction: JourneyDirection,
  rtl = false
): JourneyTransform {
  const exit = getJourneyExitTransform(direction, rtl);
  return {
    x: -exit.x * 0.65,
    y: -exit.y * 0.65,
    rotateY: -exit.rotateY * 0.5,
    rotateX: -exit.rotateX * 0.5,
    scale: 0.88,
    opacity: 0,
  };
}

export function getJourneyCenter(): JourneyTransform {
  return { ...CENTER };
}
