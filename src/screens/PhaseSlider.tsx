import { CornerUpLeft } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import type { SliderQuestion } from "../types";
import { useAppState } from "../state";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function PhaseSlider({ questions, onDone }: { questions: SliderQuestion[]; onDone: () => void }) {
  const { state, dispatch } = useAppState();
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState(50);
  const q = questions[idx];

  const progress = useMemo(() => Math.round(((idx + 1) / questions.length) * 100), [idx, questions.length]);

  const currentRun = state.currentUser === "A" ? state.userA : state.userB;
  const prior = q ? currentRun?.answersById?.[q.id] : null;
  const priorValue =
    prior && typeof prior === "object" && (prior as any).kind === "slider" ? (prior as any).value : null;

  useEffect(() => {
    if (typeof priorValue === "number") setValue(priorValue);
    else setValue(50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function commit() {
    dispatch({ type: "answer", id: q.id, answer: { kind: "slider", value } });
    if (idx === questions.length - 1) onDone();
    else setIdx((v) => v + 1);
  }

  function back() {
    if (idx > 0) setIdx((v) => v - 1);
  }

  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-ink/70">
        <div>
          Phase 3: <span className="text-banana font-semibold">Sliders</span>
        </div>
        <div className="tabular-nums">{progress}%</div>
      </div>

      <Card>
        <div className="text-xs font-semibold text-ink/70">
          {q.suit} • Q{q.id}
        </div>
        <div className="mt-4 text-lg font-bold leading-snug">{q.text}</div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-ink/70">
            <span className="max-w-[45%] text-left">{q.min}</span>
            <span className="tabular-nums text-ink/60">{value}</span>
            <span className="max-w-[45%] text-right">{q.max}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full accent-pink"
          />
          <div className="text-xs text-ink/60 leading-relaxed">
            Slide toward the truth you can live with. Not the one that makes you look hot on the internet.
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button tone="ghost" className="flex-1" onClick={back} disabled={idx === 0}>
          <CornerUpLeft size={18} /> Oops, go back
        </Button>
        <Button tone="pink" className="flex-1" onClick={commit}>
          Lock it in
        </Button>
      </div>
    </div>
  );
}

