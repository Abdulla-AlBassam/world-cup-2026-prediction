"use client";

import { Team, teamById } from "@/lib/teams";
import { cn } from "@/lib/utils";
import { Flag } from "./flag";

export function MatchCard({
  home,
  away,
  winner,
  onPick,
  label,
  readOnly,
}: {
  home: string | null;
  away: string | null;
  winner: string | null;
  onPick?: (winner: string | null) => void;
  label?: string;
  readOnly?: boolean;
}) {
  const homeTeam = home ? teamById[home] : null;
  const awayTeam = away ? teamById[away] : null;

  const handlePick = (id: string | null) => {
    if (readOnly) return;
    if (!id) return;
    onPick?.(winner === id ? null : id);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {label && (
        <div className="border-b border-border bg-paper px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
      )}
      <div className="divide-y divide-border">
        <Slot
          team={homeTeam}
          selected={!!winner && winner === home}
          dimmed={!!winner && winner !== home}
          onClick={() => handlePick(home)}
          readOnly={readOnly}
        />
        <Slot
          team={awayTeam}
          selected={!!winner && winner === away}
          dimmed={!!winner && winner !== away}
          onClick={() => handlePick(away)}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

function Slot({
  team,
  selected,
  dimmed,
  onClick,
  readOnly,
}: {
  team: Team | null;
  selected: boolean;
  dimmed: boolean;
  onClick?: () => void;
  readOnly?: boolean;
}) {
  const disabled = !team || readOnly;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition",
        selected && "bg-foreground text-background",
        !selected && team && !readOnly && "hover:bg-secondary",
        dimmed && "opacity-45",
        !team && "opacity-50",
      )}
    >
      {team ? (
        <>
          <Flag team={team} size="md" />
          <span className="flex-1 truncate text-sm font-medium">
            {team.name}
          </span>
        </>
      ) : (
        <span className="text-xs italic text-muted-foreground">
          to be determined
        </span>
      )}
    </button>
  );
}
