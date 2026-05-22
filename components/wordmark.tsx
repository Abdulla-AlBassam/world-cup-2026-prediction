import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl md:text-7xl",
    xl: "text-7xl md:text-9xl",
  };
  return (
    <div
      className={cn(
        "display font-light leading-none tracking-tighter",
        sizes[size],
        className,
      )}
    >
      <span className="font-extralight">26</span>
    </div>
  );
}

export function BrandLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-baseline gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground",
        className,
      )}
    >
      <span className="display text-base normal-case tracking-tight text-foreground">
        World Cup 2026
      </span>
      <span aria-hidden className="hidden sm:inline">/</span>
      <span className="hidden sm:inline">Prediction</span>
    </div>
  );
}
