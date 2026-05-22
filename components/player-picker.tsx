"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { players } from "@/lib/players";
import { teamById } from "@/lib/teams";
import { Flag } from "./flag";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PlayerPicker({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-input bg-paper px-3 py-2 text-left text-sm transition hover:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          {value && (() => {
            const match = players.find(
              (p) => p.name.toLowerCase() === value.toLowerCase(),
            );
            const t = match ? teamById[match.team] : null;
            return t ? <Flag team={t} size="sm" /> : null;
          })()}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(380px,calc(100vw-2rem))] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search players or type a name"
            value={draft}
            onValueChange={setDraft}
          />
          <CommandList>
            <CommandEmpty>
              <div className="space-y-2 p-2">
                <p className="text-xs text-muted-foreground">
                  No player matched. Use this name:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(draft.trim());
                    setOpen(false);
                  }}
                  className="w-full rounded-md border border-border bg-paper px-3 py-2 text-left text-sm font-medium hover:border-foreground/40"
                >
                  {draft.trim() || "Type a name above"}
                </button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {players.slice(0, 400).map((p) => {
                const team = teamById[p.team];
                return (
                  <CommandItem
                    key={p.name}
                    value={`${p.name} ${team?.name ?? ""}`}
                    onSelect={() => {
                      onChange(p.name);
                      setOpen(false);
                    }}
                  >
                    <div className="flex flex-1 items-center gap-2.5">
                      {team && <Flag team={team} size="sm" />}
                      <span className="flex-1 truncate text-sm">{p.name}</span>
                      {team && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {team.id}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-2 h-3.5 w-3.5",
                        value === p.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function TeamPicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const all = Object.values(teamById).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const team = value ? teamById[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md border border-input bg-paper px-3 py-2 text-left text-sm transition hover:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          {team ? (
            <>
              <Flag team={team} size="sm" />
              <span className="flex-1 truncate">{team.name}</span>
            </>
          ) : (
            <span className="flex-1">Pick a team</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(380px,calc(100vw-2rem))] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search teams" />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {all.map((t) => (
                <CommandItem
                  key={t.id}
                  value={t.name}
                  onSelect={() => {
                    onChange(t.id);
                    setOpen(false);
                  }}
                >
                  <Flag team={t} size="sm" />
                  <span className="flex-1 truncate text-sm">{t.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {t.id}
                  </span>
                  <Check
                    className={cn(
                      "ml-2 h-3.5 w-3.5",
                      value === t.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

void Input;
