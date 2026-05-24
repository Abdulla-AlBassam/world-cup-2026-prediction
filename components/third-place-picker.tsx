"use client";

import { groupLetters, GroupLetter, teamById } from "@/lib/teams";
import { useBracket } from "@/lib/store";
import { Flag } from "./flag";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ThirdPlacePicker({ readOnly }: { readOnly?: boolean }) {
  const standings = useBracket((s) => s.bracket.standings);
  const advancing = useBracket((s) => s.bracket.advancingThirds);
  const toggle = useBracket((s) => s.toggleAdvancingThird);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex justify-end">
        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {advancing.length} of 8
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {groupLetters.map((g) => {
          const teamId = standings[g]?.[2];
          if (!teamId) return null;
          const team = teamById[teamId];
          if (!team) return null;
          const selected = advancing.includes(g as GroupLetter);
          const full = advancing.length >= 8 && !selected;
          return (
            <button
              key={g}
              type="button"
              disabled={readOnly || full}
              onClick={() => toggle(g as GroupLetter)}
              className={cn(
                "group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-paper hover:border-foreground/40",
                full && "opacity-40 cursor-not-allowed",
              )}
            >
              <Flag team={team} size="md" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{team.name}</div>
                <div
                  className={cn(
                    "text-[10px] uppercase tracking-[0.16em]",
                    selected ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  3rd, Group {g}
                </div>
              </div>
              {selected && <Check className="h-4 w-4 flex-none" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
