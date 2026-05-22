"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { GroupLetter, teamById, teamsByGroup } from "@/lib/teams";
import { useBracket } from "@/lib/store";
import { Flag } from "./flag";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";

export function GroupCard({
  group,
  readOnly,
}: {
  group: GroupLetter;
  readOnly?: boolean;
}) {
  const standings = useBracket((s) => s.bracket.standings[group]);
  const setGroupOrder = useBracket((s) => s.setGroupOrder);

  const initial = useMemo(
    () => teamsByGroup[group].map((t) => t.id),
    [group],
  );

  useEffect(() => {
    if (standings.every((id) => !id)) {
      setGroupOrder(group, initial);
    }
  }, [group, initial, setGroupOrder, standings]);

  const order = standings.every((id) => !id) ? initial : standings;

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setGroupOrder(group, next);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="display text-2xl font-medium tracking-tight">
          Group {group}
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Rank 1 to 4
        </span>
      </div>
      <ol className="space-y-1.5">
        <AnimatePresence initial={false}>
          {order.map((id, idx) => {
            const t = teamById[id];
            if (!t) return null;
            const rank = idx + 1;
            const advances = idx < 2;
            const third = idx === 2;
            return (
              <motion.li
                key={id}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border bg-paper px-3 py-2.5",
                  advances
                    ? "border-foreground/20"
                    : third
                      ? "border-border"
                      : "border-border opacity-60",
                )}
              >
                <span
                  className={cn(
                    "display w-6 text-center text-xl tabular-nums",
                    advances ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {rank}
                </span>
                <Flag team={t} size="md" />
                <span className="flex-1 truncate text-sm font-medium">
                  {t.name}
                </span>
                {!readOnly && (
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="rounded p-1 text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
                      aria-label={`Move ${t.name} up`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === order.length - 1}
                      className="rounded p-1 text-muted-foreground transition hover:bg-secondary disabled:opacity-30"
                      aria-label={`Move ${t.name} down`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
}
