import { GroupLetter, groupLetters } from "./teams";

type SlotKind = "winner" | "runnerUp" | "third";
type Slot = {
  kind: SlotKind;
  group?: GroupLetter;
  thirdEligibleGroups?: GroupLetter[];
};

export type R32MatchDef = {
  id: number;
  home: Slot;
  away: Slot;
};

export const r32Matches: R32MatchDef[] = [
  { id: 1, home: { kind: "runnerUp", group: "A" }, away: { kind: "runnerUp", group: "B" } },
  { id: 2, home: { kind: "winner", group: "E" }, away: { kind: "third", thirdEligibleGroups: ["A", "B", "C", "D", "F"] } },
  { id: 3, home: { kind: "winner", group: "F" }, away: { kind: "runnerUp", group: "C" } },
  { id: 4, home: { kind: "winner", group: "C" }, away: { kind: "runnerUp", group: "F" } },
  { id: 5, home: { kind: "winner", group: "I" }, away: { kind: "third", thirdEligibleGroups: ["C", "D", "F", "G", "H"] } },
  { id: 6, home: { kind: "runnerUp", group: "E" }, away: { kind: "runnerUp", group: "I" } },
  { id: 7, home: { kind: "winner", group: "A" }, away: { kind: "third", thirdEligibleGroups: ["C", "E", "F", "H", "I"] } },
  { id: 8, home: { kind: "winner", group: "L" }, away: { kind: "third", thirdEligibleGroups: ["E", "H", "I", "J", "K"] } },
  { id: 9, home: { kind: "winner", group: "D" }, away: { kind: "third", thirdEligibleGroups: ["B", "E", "F", "I", "J"] } },
  { id: 10, home: { kind: "winner", group: "G" }, away: { kind: "third", thirdEligibleGroups: ["A", "E", "H", "I", "J"] } },
  { id: 11, home: { kind: "runnerUp", group: "K" }, away: { kind: "runnerUp", group: "L" } },
  { id: 12, home: { kind: "winner", group: "H" }, away: { kind: "runnerUp", group: "J" } },
  { id: 13, home: { kind: "winner", group: "B" }, away: { kind: "third", thirdEligibleGroups: ["E", "F", "G", "I", "J"] } },
  { id: 14, home: { kind: "winner", group: "J" }, away: { kind: "runnerUp", group: "H" } },
  { id: 15, home: { kind: "winner", group: "K" }, away: { kind: "third", thirdEligibleGroups: ["D", "E", "I", "J", "L"] } },
  { id: 16, home: { kind: "runnerUp", group: "D" }, away: { kind: "runnerUp", group: "G" } },
];

export const r16Pairs: [number, number][] = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10],
  [11, 12],
  [13, 14],
  [15, 16],
];

export const qfPairs: [number, number][] = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
];

export const sfPairs: [number, number][] = [
  [1, 2],
  [3, 4],
];

export type GroupStanding = Record<GroupLetter, string[]>;

export function assignThirdSlots(
  advancingThirds: GroupLetter[],
): Record<number, GroupLetter | null> {
  const thirdSlots = r32Matches.filter((m) => m.away.kind === "third");
  const result: Record<number, GroupLetter | null> = {};
  const used = new Set<GroupLetter>();

  for (const slot of thirdSlots) {
    const eligible = slot.away.thirdEligibleGroups ?? [];
    const pick = advancingThirds.find(
      (g) => eligible.includes(g) && !used.has(g),
    );
    if (pick) {
      result[slot.id] = pick;
      used.add(pick);
    } else {
      result[slot.id] = null;
    }
  }
  return result;
}

export function resolveSlot(
  slot: Slot,
  standings: GroupStanding,
  thirdAssignments: Record<number, GroupLetter | null>,
  matchId: number,
): string | null {
  if (slot.kind === "winner" && slot.group) {
    return standings[slot.group]?.[0] ?? null;
  }
  if (slot.kind === "runnerUp" && slot.group) {
    return standings[slot.group]?.[1] ?? null;
  }
  if (slot.kind === "third") {
    const assignedGroup = thirdAssignments[matchId];
    if (!assignedGroup) return null;
    return standings[assignedGroup]?.[2] ?? null;
  }
  return null;
}

export const thirdPlaceMatchId = 1000;
export const finalMatchId = 1001;

export type BracketState = {
  standings: GroupStanding;
  advancingThirds: GroupLetter[];
  r32Winners: Record<number, string | null>;
  r16Winners: Record<number, string | null>;
  qfWinners: Record<number, string | null>;
  sfWinners: Record<number, string | null>;
  champion: string | null;
  thirdPlace: string | null;
};

export function makeEmptyBracket(): BracketState {
  const standings = {} as GroupStanding;
  for (const g of groupLetters) standings[g] = ["", "", "", ""];
  return {
    standings,
    advancingThirds: [],
    r32Winners: {},
    r16Winners: {},
    qfWinners: {},
    sfWinners: {},
    champion: null,
    thirdPlace: null,
  };
}
