import { cn } from "@/lib/utils";
import { Team } from "@/lib/teams";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizes: Record<Size, string> = {
  xs: "h-3 w-[18px]",
  sm: "h-4 w-6",
  md: "h-5 w-8",
  lg: "h-7 w-11",
  xl: "h-10 w-16",
  "2xl": "h-16 w-24",
};

export function Flag({
  team,
  size = "md",
  className,
  rounded = true,
}: {
  team: Team;
  size?: Size;
  className?: string;
  rounded?: boolean;
}) {
  return (
    <span
      className={cn(
        "fi inline-block flex-none overflow-hidden bg-cover bg-center bg-no-repeat flag-shadow",
        `fi-${team.code}`,
        sizes[size],
        rounded && "rounded-[3px]",
        className,
      )}
      title={team.name}
      role="img"
      aria-label={`${team.name} flag`}
    />
  );
}
