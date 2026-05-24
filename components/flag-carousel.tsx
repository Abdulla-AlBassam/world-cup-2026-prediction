"use client";

import { teams } from "@/lib/teams";
import { Flag } from "./flag";

export function FlagCarousel() {
  const doubled = [...teams, ...teams];
  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee items-center gap-6">
        {doubled.map((team, idx) => (
          <div
            key={`${team.id}-${idx}`}
            className="flex flex-col items-center gap-2"
          >
            <Flag team={team} size="3xl" />
            <span className="font-sans text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {team.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
