import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, CornerUpLeft } from "lucide-react";
import React, { useMemo, useState } from "react";
import type { SwipeAnswer, SwipeQuestion } from "../types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAppState } from "../state";

function SwipeCard({
  question,
  onSwipe,
}: {
  question: SwipeQuestion;
  onSwipe: (dir: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rot = useTransform(x, [-160, 160], [-9, 9]);
  const yes = useTransform(x, [40, 160], [0, 1]);
  const no = useTransform(x, [-160, -40], [1, 0]);

  return (
    <div className="relative h-[340px]">
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ x, rotate: rot }}
        drag="x"
        dragConstraints={{ left: -220, right: 220 }}
        onDragEnd={() => {
          const currentX = x.get();
          if (currentX > 60) onSwipe("right");
          else if (currentX < -60) onSwipe("left");
          else x.set(0);
        }}
      >
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div className="text-xs font-semibold text-ink/70">
              {question.suit} • Q{question.id}
            </div>
            <div className="flex gap-2 text-xs">
              <motion.div style={{ opacity: no }} className="px-2 py-1 rounded-lg bg-black/30 border border-smoke2">
                NOPE
              </motion.div>
              <motion.div style={{ opacity: yes }} className="px-2 py-1 rounded-lg bg-pink/20 border border-pink/40">
                YES
              </motion.div>
            </div>
          </div>
          <div className="mt-4 text-lg font-bold leading-snug">{question.text}</div>
          <div className="mt-4 text-sm text-ink/65 leading-relaxed">
            Swipe like you mean it. This is not a morality exam. It’s a mirror with neon trim.
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export function PhaseSwipe({ questions, onDone }: { questions: SwipeQuestion[]; onDone: () => void }) {
  const { state, dispatch } = useAppState();
  const [idx, setIdx] = useState(0);
  const q = questions[idx];

  const progress = useMemo(() => Math.round(((idx + 1) / questions.length) * 100), [idx, questions.length]);

  function record(dir: "left" | "right") {
    if (!q) return;
    const answer: SwipeAnswer = { kind: "swipe", dir };
    dispatch({ type: "answer", id: q.id, answer });
    if (idx === questions.length - 1) onDone();
    else setIdx((v) => v + 1);
  }

  function back() {
    if (idx > 0) setIdx((v) => v - 1);
  }

  if (!q) return null;

  const currentRun = state.currentUser === "A" ? state.userA : state.userB;
  const prior = currentRun?.answersById?.[q.id];
  const priorDir = prior && typeof prior === "object" && (prior as any).kind === "swipe" ? (prior as any).dir : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-ink/70">
        <div>
          Phase 1: <span className="text-banana font-semibold">Swipes</span>
        </div>
        <div className="flex items-center gap-3">
          {priorDir ? (
            <div className="hidden sm:block text-xs text-ink/60">
              Previously:{" "}
              <span className={priorDir === "right" ? "text-pink font-semibold" : "text-ink font-semibold"}>
                {priorDir === "right" ? "YES" : "NOPE"}
              </span>
            </div>
          ) : null}
          <div className="tabular-nums">{progress}%</div>
        </div>
      </div>

      <SwipeCard key={q.id} question={q} onSwipe={record} />

      <div className="flex gap-3">
        <Button tone="ghost" className="flex-1" onClick={back} disabled={idx === 0}>
          <CornerUpLeft size={18} /> Oops, go back
        </Button>
        <Button tone="ghost" className="flex-1" onClick={() => record("left")}>
          <ArrowLeft size={18} /> Left (No)
        </Button>
        <Button tone="pink" className="flex-1" onClick={() => record("right")}>
          Right (Yes) <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}

