import { Sparkles, Users } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { useAppState } from "../state";

export function Landing() {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState("");

  const subtitle = useMemo(() => {
    if (state.mode === "compare" && state.userA) {
      return (
        <>
          You are <span className="text-banana font-semibold">User B</span>. User A is{" "}
          <span className="text-pink font-semibold">{state.userA.name}</span>. Your job is not to be perfect.
          Your job is to be <span className="text-banana font-semibold">honest</span>, because the only game here is
          win–win.
        </>
      );
    }
    return (
      <>
        This is the Infinite / Finite Match Test: a relationship weather check for fascist storm clouds and banana
        peels before you slip on them. Honesty matters here because the prize isn&apos;t winning—it&apos;s a
        relationship where both of you get to keep playing.
      </>
    );
  }, [state.mode, state.userA]);

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-black tracking-tight">Relationship Weather Game</div>
            <div className="mt-1 text-sm text-ink/75">{subtitle}</div>
            <div className="mt-3 text-xs text-ink/65">
              You&apos;ll answer <span className="font-semibold text-banana">60 short questions</span> in about{" "}
              <span className="font-semibold text-banana">10–12 minutes</span>. No login, no saving to a server—your
              data lives in this browser and in any link you choose to share.
            </div>
          </div>
          <div className="shrink-0 rounded-xl bg-smoke border border-smoke2 p-2">
            {state.mode === "compare" ? <Users className="text-banana" /> : <Sparkles className="text-pink" />}
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <label className="text-xs font-semibold text-ink/70">Name</label>
          <input
            className="w-full rounded-xl bg-black/30 border border-smoke2 px-4 py-3 outline-none focus:ring-2 focus:ring-pink/60"
            placeholder={state.mode === "compare" ? "User B… be brave" : "Your name, cosmic gremlin"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {state.mode === "compare" ? (
            <div className="text-xs text-ink/60">
              User A is locked in via link. Your name is yours to write. Your answers are yours to own.
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <Button
            tone="pink"
            className="flex-1 min-w-[140px] justify-center py-3 text-base font-semibold"
            onClick={() => dispatch({ type: "start", name: name.trim() || (state.mode === "compare" ? "User B" : "Anonymous Muppet") })}
          >
            Let&apos;s play
          </Button>
          <button
            type="button"
            className="text-xs text-ink/60 underline-offset-2 hover:underline"
            onClick={() => setName("")}
          >
            clear name
          </button>
        </div>
      </Card>

      <div className="text-xs text-ink/60 leading-relaxed">
        This machine will be cheeky, kind, and scrupulously honest. If you came for comfort, you may experience
        weather.
      </div>
    </div>
  );
}

