import type { TimeSignature } from "@/src/constants/metronome";
import { useEffect, useRef } from "react";

type UseMetronomeParams = {
  bpm: number;
  isRunning: boolean;
  isMuted: boolean;
  timeSignature: TimeSignature;
  onBeat: (params: { beat: number; isAccent: boolean }) => void;
};

export function useMetronome({
  bpm,
  isRunning,
  isMuted,
  timeSignature,
  onBeat,
}: UseMetronomeParams) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bpmRef = useRef(bpm);
  const beatRef = useRef(1);
  const nextTickTimeRef = useRef(0);
  const onBeatRef = useRef(onBeat);

  bpmRef.current = bpm;
  onBeatRef.current = onBeat;

  useEffect(() => {
    beatRef.current = 1;
  }, [timeSignature.value]);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      beatRef.current = 1;
      return;
    }

    nextTickTimeRef.current = performance.now();

    const schedule = () => {
      const now = performance.now();
      const intervalMs = 60_000 / bpmRef.current;

      if (now >= nextTickTimeRef.current) {
        const beat = beatRef.current;
        const isAccent = timeSignature.accents.includes(beat);

        onBeatRef.current({ beat, isAccent });

        if (!isMuted) {
          // Play click
        }

        beatRef.current =
          beatRef.current >= timeSignature.beatsPerBar
            ? 1
            : beatRef.current + 1;

        nextTickTimeRef.current += intervalMs;
      }

      timerRef.current = setTimeout(schedule, 8);
    };

    schedule();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isMuted,
    isRunning,
    timeSignature.accents,
    timeSignature.beatsPerBar,
    timeSignature.value,
  ]);
}
