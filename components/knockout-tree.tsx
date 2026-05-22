"use client";

import { useBracket, getMatchTeams } from "@/lib/store";
import { MatchCard } from "./match-card";
import { r32Matches, r16Pairs, qfPairs, sfPairs } from "@/lib/bracket";
import { Flag } from "./flag";
import { teamById } from "@/lib/teams";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function KnockoutTree({ readOnly }: { readOnly?: boolean }) {
  const bracket = useBracket((s) => s.bracket);
  const setWinner = useBracket((s) => s.setMatchWinner);

  return (
    <div className="space-y-12">
      <Round
        title="Round of 32"
        meta="16 matches"
        matches={r32Matches.map((m) => ({ id: m.id }))}
        getTeams={(id) => getMatchTeams(bracket, "r32", id)}
        getWinner={(id) => bracket.r32Winners[id] ?? null}
        onPick={(id, w) => setWinner("r32", id, w)}
        cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        readOnly={readOnly}
      />
      <Round
        title="Round of 16"
        meta="8 matches"
        matches={r16Pairs.map((_, i) => ({ id: i + 1 }))}
        getTeams={(id) => getMatchTeams(bracket, "r16", id)}
        getWinner={(id) => bracket.r16Winners[id] ?? null}
        onPick={(id, w) => setWinner("r16", id, w)}
        cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        readOnly={readOnly}
      />
      <Round
        title="Quarter-finals"
        meta="4 matches"
        matches={qfPairs.map((_, i) => ({ id: i + 1 }))}
        getTeams={(id) => getMatchTeams(bracket, "qf", id)}
        getWinner={(id) => bracket.qfWinners[id] ?? null}
        onPick={(id, w) => setWinner("qf", id, w)}
        cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        readOnly={readOnly}
      />
      <Round
        title="Semi-finals"
        meta="2 matches"
        matches={sfPairs.map((_, i) => ({ id: i + 1 }))}
        getTeams={(id) => getMatchTeams(bracket, "sf", id)}
        getWinner={(id) => bracket.sfWinners[id] ?? null}
        onPick={(id, w) => setWinner("sf", id, w)}
        cols="grid-cols-1 md:grid-cols-2"
        readOnly={readOnly}
      />

      <ThirdPlaceMatch readOnly={readOnly} />
      <FinalMatch readOnly={readOnly} />
    </div>
  );
}

function Round({
  title,
  meta,
  matches,
  getTeams,
  getWinner,
  onPick,
  cols,
  readOnly,
}: {
  title: string;
  meta: string;
  matches: { id: number }[];
  getTeams: (id: number) => { home: string | null; away: string | null };
  getWinner: (id: number) => string | null;
  onPick: (id: number, w: string | null) => void;
  cols: string;
  readOnly?: boolean;
}) {
  return (
    <section>
      <RoundHeader title={title} meta={meta} />
      <div className={cn("grid gap-3", cols)}>
        {matches.map((m) => {
          const { home, away } = getTeams(m.id);
          return (
            <MatchCard
              key={m.id}
              home={home}
              away={away}
              winner={getWinner(m.id)}
              onPick={(w) => onPick(m.id, w)}
              label={`M${m.id}`}
              readOnly={readOnly}
            />
          );
        })}
      </div>
    </section>
  );
}

function RoundHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
      <h3 className="display text-2xl font-medium tracking-tight">{title}</h3>
      <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {meta}
      </span>
    </div>
  );
}

function ThirdPlaceMatch({ readOnly }: { readOnly?: boolean }) {
  const bracket = useBracket((s) => s.bracket);
  const setWinner = useBracket((s) => s.setMatchWinner);
  const { home, away } = getMatchTeams(bracket, "third", 0);

  return (
    <section>
      <RoundHeader title="Third place playoff" meta="July 18" />
      <div className="mx-auto max-w-md">
        <MatchCard
          home={home}
          away={away}
          winner={bracket.thirdPlace}
          onPick={(w) => setWinner("third", 0, w)}
          label="Bronze medal"
          readOnly={readOnly}
        />
      </div>
    </section>
  );
}

function FinalMatch({ readOnly }: { readOnly?: boolean }) {
  const bracket = useBracket((s) => s.bracket);
  const setWinner = useBracket((s) => s.setMatchWinner);
  const { home, away } = getMatchTeams(bracket, "final", 0);
  const champion = bracket.champion ? teamById[bracket.champion] : null;

  return (
    <section>
      <RoundHeader title="Final" meta="July 19, MetLife Stadium" />
      <div className="mx-auto max-w-md">
        <MatchCard
          home={home}
          away={away}
          winner={bracket.champion}
          onPick={(w) => setWinner("final", 0, w)}
          label="Final"
          readOnly={readOnly}
        />
      </div>

      {champion && (
        <div className="mt-10 flex flex-col items-center text-center">
          <Trophy className="h-6 w-6 text-[var(--accent-red)]" />
          <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Your prediction for champion
          </p>
          <div className="mt-4 flex items-center gap-4">
            <Flag team={champion} size="2xl" />
            <span className="display text-4xl font-light tracking-tight md:text-6xl">
              {champion.name}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
