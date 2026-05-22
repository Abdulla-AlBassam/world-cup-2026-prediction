"use client";

import { useBracket } from "@/lib/store";
import { PlayerPicker, TeamPicker } from "./player-picker";

const awards = [
  {
    key: "goldenBall" as const,
    name: "Golden Ball",
    sub: "Best player of the tournament",
  },
  {
    key: "goldenBoot" as const,
    name: "Golden Boot",
    sub: "Top scorer",
  },
  {
    key: "goldenGlove" as const,
    name: "Golden Glove",
    sub: "Best goalkeeper",
  },
  {
    key: "youngPlayer" as const,
    name: "Best Young Player",
    sub: "Born 1 January 2005 or later",
  },
];

export function AwardsSection({ readOnly }: { readOnly?: boolean }) {
  const awardsState = useBracket((s) => s.awards);
  const setAward = useBracket((s) => s.setAward);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {awards.map((a) => (
        <div key={a.key} className="rounded-xl border border-border bg-card p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h3 className="display text-xl font-medium tracking-tight">
              {a.name}
            </h3>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">{a.sub}</p>
          <PlayerPicker
            value={awardsState[a.key]}
            onChange={(v) => setAward(a.key, v)}
            placeholder="Pick or type a player"
            disabled={readOnly}
          />
        </div>
      ))}

      <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
        <div className="mb-1 flex items-baseline justify-between">
          <h3 className="display text-xl font-medium tracking-tight">
            Fair Play Trophy
          </h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Awarded to the team with the best record of fair play
        </p>
        <TeamPicker
          value={awardsState.fairPlay}
          onChange={(v) => setAward("fairPlay", v)}
          disabled={readOnly}
        />
      </div>
    </div>
  );
}
