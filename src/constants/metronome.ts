export const MIN_BPM = 30;
export const MAX_BPM = 240;
export const DEFAULT_BPM = 120;

export type TimeSignature = {
  label: string;
  value: string;
  beatsPerBar: number;
  accents: number[];
};

export const TIME_SIGNATURES: TimeSignature[] = [
  { label: "2/4", value: "2/4", beatsPerBar: 2, accents: [1] },
  { label: "3/4", value: "3/4", beatsPerBar: 3, accents: [1] },
  { label: "4/4", value: "4/4", beatsPerBar: 4, accents: [1] },
  { label: "6/8", value: "6/8", beatsPerBar: 6, accents: [1, 4] },
];

export function normalizeBpm(value: number): number {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}
