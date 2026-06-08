import { cn } from "@/lib/utils";

type SectionMeshProps = {
  variant?: "warm" | "cool" | "hero";
  className?: string;
};

export function SectionMesh({ variant = "warm", className }: SectionMeshProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "absolute -top-[20%] -end-[10%] h-[55%] w-[55%] rounded-full blur-[100px]",
          variant === "hero" && "bg-brand-accent/25",
          variant === "warm" && "bg-brand-accent/18",
          variant === "cool" && "bg-brand-primary/6"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-[15%] -start-[10%] h-[45%] w-[45%] rounded-full blur-[90px]",
          variant === "hero" && "bg-brand-accent/15",
          variant === "warm" && "bg-brand-accent/12",
          variant === "cool" && "bg-brand-accent/8"
        )}
      />
      {variant === "hero" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,205,87,0.22),transparent_55%)]" />
      )}
    </div>
  );
}
