"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BracketState,
  GroupStanding,
  assignThirdSlots,
  finalMatchId,
  makeEmptyBracket,
  qfPairs,
  r16Pairs,
  r32Matches,
  resolveSlot,
  sfPairs,
  thirdPlaceMatchId,
} from "./bracket";
import { GroupLetter } from "./teams";
import { makeEmptyPayload, PredictionPayload } from "./encode";

type Awards = PredictionPayload["a"];

type Store = {
  name: string;
  bracket: BracketState;
  awards: Awards;
  setName: (name: string) => void;
  setGroupOrder: (group: GroupLetter, ordered: string[]) => void;
  toggleAdvancingThird: (group: GroupLetter) => void;
  setMatchWinner: (
    round: "r32" | "r16" | "qf" | "sf" | "final" | "third",
    id: number,
    winner: string | null,
  ) => void;
  setAward: (key: keyof Awards, value: string) => void;
  loadFromPayload: (p: PredictionPayload) => void;
  toPayload: () => PredictionPayload;
  reset: () => void;
};

export const useBracket = create<Store>()(
  persist(
    (set, get) => ({
      name: "",
      bracket: makeEmptyBracket(),
      awards: makeEmptyPayload().a,

      setName: (name) => set({ name }),

      setGroupOrder: (group, ordered) =>
        set((state) => ({
          bracket: {
            ...state.bracket,
            standings: {
              ...state.bracket.standings,
              [group]: ordered,
            } as GroupStanding,
          },
        })),

      toggleAdvancingThird: (group) =>
        set((state) => {
          const has = state.bracket.advancingThirds.includes(group);
          let next = has
            ? state.bracket.advancingThirds.filter((g) => g !== group)
            : [...state.bracket.advancingThirds, group];
          if (next.length > 8) next = next.slice(-8);
          return {
            bracket: { ...state.bracket, advancingThirds: next },
          };
        }),

      setMatchWinner: (round, id, winner) =>
        set((state) => {
          const b = { ...state.bracket };
          if (round === "r32") b.r32Winners = { ...b.r32Winners, [id]: winner };
          else if (round === "r16")
            b.r16Winners = { ...b.r16Winners, [id]: winner };
          else if (round === "qf")
            b.qfWinners = { ...b.qfWinners, [id]: winner };
          else if (round === "sf")
            b.sfWinners = { ...b.sfWinners, [id]: winner };
          else if (round === "final") b.champion = winner;
          else if (round === "third") b.thirdPlace = winner;
          return { bracket: b };
        }),

      setAward: (key, value) =>
        set((state) => ({
          awards: { ...state.awards, [key]: value },
        })),

      loadFromPayload: (p) =>
        set({ name: p.n ?? "", bracket: p.s, awards: p.a }),

      toPayload: () => {
        const { name, bracket, awards } = get();
        const payload: PredictionPayload = {
          v: 1,
          s: bracket,
          a: awards,
        };
        if (name) payload.n = name;
        return payload;
      },

      reset: () =>
        set({
          name: "",
          bracket: makeEmptyBracket(),
          awards: makeEmptyPayload().a,
        }),
    }),
    {
      name: "wc26-bracket",
    },
  ),
);

export function getMatchTeams(
  bracket: BracketState,
  round: "r32" | "r16" | "qf" | "sf" | "final" | "third",
  id: number,
): { home: string | null; away: string | null } {
  if (round === "r32") {
    const match = r32Matches.find((m) => m.id === id);
    if (!match) return { home: null, away: null };
    const thirdAssign = assignThirdSlots(bracket.advancingThirds);
    return {
      home: resolveSlot(match.home, bracket.standings, thirdAssign, id),
      away: resolveSlot(match.away, bracket.standings, thirdAssign, id),
    };
  }
  if (round === "r16") {
    const pair = r16Pairs[id - 1];
    if (!pair) return { home: null, away: null };
    return {
      home: bracket.r32Winners[pair[0]] ?? null,
      away: bracket.r32Winners[pair[1]] ?? null,
    };
  }
  if (round === "qf") {
    const pair = qfPairs[id - 1];
    if (!pair) return { home: null, away: null };
    return {
      home: bracket.r16Winners[pair[0]] ?? null,
      away: bracket.r16Winners[pair[1]] ?? null,
    };
  }
  if (round === "sf") {
    const pair = sfPairs[id - 1];
    if (!pair) return { home: null, away: null };
    return {
      home: bracket.qfWinners[pair[0]] ?? null,
      away: bracket.qfWinners[pair[1]] ?? null,
    };
  }
  if (round === "final") {
    return {
      home: bracket.sfWinners[1] ?? null,
      away: bracket.sfWinners[2] ?? null,
    };
  }
  if (round === "third") {
    const sf1Home = bracket.qfWinners[1];
    const sf1Away = bracket.qfWinners[2];
    const sf2Home = bracket.qfWinners[3];
    const sf2Away = bracket.qfWinners[4];
    const sf1Winner = bracket.sfWinners[1];
    const sf2Winner = bracket.sfWinners[2];
    const sf1Loser =
      sf1Winner && (sf1Home === sf1Winner ? sf1Away : sf1Home);
    const sf2Loser =
      sf2Winner && (sf2Home === sf2Winner ? sf2Away : sf2Home);
    return {
      home: sf1Loser ?? null,
      away: sf2Loser ?? null,
    };
  }
  return { home: null, away: null };
}

void thirdPlaceMatchId;
void finalMatchId;
