import { motion } from "framer-motion";
import { ChevronDown, CornerUpLeft } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { ScenarioQuestion } from "../types";
import { useAppState } from "../state";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function PhaseScenario({ questions, onDone }: { questions: ScenarioQuestion[]; onDone: () => void }) {
  const { state, dispatch } = useAppState();
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(true);
  const q = questions[idx];

  const progress = useMemo(() => Math.round(((idx + 1) / questions.length) * 100), [idx, questions.length]);

  function choose(optionIndex: number) {
    dispatch({ type: "answer", id: q.id, answer: { kind: "scenario", optionIndex } });
    setOpen(true);
    if (idx === questions.length - 1) onDone();
    else setIdx((v) => v + 1);
  }

  function back() {
    if (idx > 0) setIdx((v) => v - 1);
  }

  if (!q) return null;

  const currentRun = state.currentUser === "A" ? state.userA : state.userB;
  const prior = currentRun?.answersById?.[q.id];
  const priorIdx =
    prior && typeof prior === "object" && (prior as any).kind === "scenario" ? (prior as any).optionIndex : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-ink/70">
        <div>
          Phase 2: <span className="text-banana font-semibold">Scenarios</span>
        </div>
        <div className="flex items-center gap-3">
          {typeof priorIdx === "number" ? (
            <div className="hidden sm:block text-xs text-ink/60">
              Previously: <span className="text-pink font-semibold">Option {priorIdx + 1}</span>
            </div>
          ) : null}
          <div className="tabular-nums">{progress}%</div>
        </div>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="text-xs font-semibold text-ink/70">
            {q.suit} • Q{q.id}
          </div>
          <button
            className="inline-flex items-center gap-1 text-xs text-ink/70 hover:text-ink"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Collapse" : "Reveal"} <ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"} />
          </button>
        </div>

        <div className="mt-4 text-lg font-bold leading-snug">{q.text}</div>

        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="mt-4 grid gap-3">
            {q.options.map((o, i) => (
              <button
                key={i}
                className="text-left rounded-xl border border-smoke2 bg-black/25 hover:bg-black/35 px-4 py-3 transition"
                onClick={() => choose(i)}
              >
                <div className="text-sm font-semibold">{o.text}</div>
                <div className="text-xs text-ink/60 mt-1">Choose quickly. Overthinking is just fear wearing glasses.</div>
              </button>
            ))}
          </div>
        </motion.div>
      </Card>

      <div className="flex gap-3">
        <Button tone="ghost" className="flex-1" onClick={back} disabled={idx === 0}>
          <CornerUpLeft size={18} /> Oops, go back
        </Button>
        <Button tone="ghost" className="flex-1" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide options" : "Show options"}
        </Button>
      </div>
    </div>
  );
}

