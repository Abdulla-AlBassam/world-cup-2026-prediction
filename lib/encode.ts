import LZString from "lz-string";
import { BracketState, makeEmptyBracket } from "./bracket";

export type PredictionPayload = {
  v: 1;
  n?: string;
  s: BracketState;
  a: {
    goldenBall: string;
    goldenBoot: string;
    goldenGlove: string;
    youngPlayer: string;
    fairPlay: string;
  };
};

export function makeEmptyPayload(): PredictionPayload {
  return {
    v: 1,
    s: makeEmptyBracket(),
    a: {
      goldenBall: "",
      goldenBoot: "",
      goldenGlove: "",
      youngPlayer: "",
      fairPlay: "",
    },
  };
}

export function encodePayload(payload: PredictionPayload): string {
  const json = JSON.stringify(payload);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodePayload(encoded: string): PredictionPayload | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (!parsed || parsed.v !== 1) return null;
    return parsed as PredictionPayload;
  } catch {
    return null;
  }
}
