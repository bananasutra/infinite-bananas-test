import { Copy, Link2, RotateCcw } from "lucide-react";
import React, { useMemo, useState } from "react";
import { byId } from "../questions";
import { encodeRunToParam } from "../share";
import { oracleWeatherReport, scoreRun } from "../scoring";
import { useAppState } from "../state";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Bananometer } from "../ui/Bananometer";

export function Reveal() {
  const { state, dispatch } = useAppState();
  const [copied, setCopied] = useState(false);

  const runA = state.userA;
  const runB = state.userB;

  const scoresA = useMemo(() => (runA ? scoreRun(runA, byId) : null), [runA]);
  const scoresB = useMemo(() => (runB ? scoreRun(runB, byId) : null), [runB]);

  const shareUrl = useMemo(() => {
    if (!runA) return null;
    const param = encodeRunToParam(runA);
    const url = new URL(window.location.href);
    url.searchParams.set("results", param);
    return url.toString();
  }, [runA]);

  const oracle = useMemo(() => {
    if (!scoresA) return null;
    if (state.mode === "compare" && scoresB) return oracleWeatherReport(scoresA, scoresB);
    return {
      title: "🔮 Solo Reading",
      body:
        "You have stared into the mirror. Now be normal about it (impossible). Share a link to summon User B, and the Oracle will compare the weather systems.",
      flags: { highBanana: false, seanWarning: false },
    };
  }, [scoresA, scoresB, state.mode]);

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // fallback: do nothing
    }
  }

  if (!scoresA || !oracle) return null;

  const bananaForMeter = state.mode === "compare" && scoresB ? Math.max(scoresA.bananaPct, scoresB.bananaPct) : scoresA.bananaPct;

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-sm font-semibold text-ink/70">The Reveal</div>
        <div className="mt-2 text-2xl font-black tracking-tight text-banana">Relationship Weather Report</div>
        <div className="mt-3 rounded-xl border border-smoke2 bg-black/25 px-4 py-3">
          <div className="text-xs font-semibold tracking-wide text-ink/60">Overall match climate</div>
          <div className="text-lg font-bold">{oracle.title}</div>
          <div className="mt-2 text-sm text-ink/75 leading-relaxed">{oracle.body}</div>
        </div>
      </Card>

      <Bananometer bananaPct={bananaForMeter} />

      <Card>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-smoke2 bg-black/20 px-4 py-3">
            <div className="text-xs text-ink/60">Infinite</div>
            <div className="text-xl font-black text-banana tabular-nums">{scoresA.infinitePct.toFixed(1)}%</div>
            <div className="text-xs text-ink/60">Finite {scoresA.finitePct.toFixed(1)}%</div>
          </div>
          <div className="rounded-xl border border-smoke2 bg-black/20 px-4 py-3">
            <div className="text-xs text-ink/60">Grifter Tilt</div>
            <div className="text-xl font-black text-pink tabular-nums">{scoresA.grifterPct.toFixed(1)}%</div>
            <div className="text-xs text-ink/60">Banana {scoresA.bananaPct.toFixed(1)}%</div>
          </div>
        </div>

        {state.mode === "compare" && scoresB && runB ? (
          <div className="mt-4 rounded-xl border border-smoke2 bg-black/15 px-4 py-3">
            <div className="text-xs font-semibold text-ink/70">Comparison</div>
            <div className="mt-2 text-sm text-ink/75">
              <span className="text-pink font-semibold">{runA?.name}</span> vs{" "}
              <span className="text-banana font-semibold">{runB.name}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-ink/65 tabular-nums">
              <div className="rounded-xl border border-smoke2 bg-black/20 px-3 py-2">
                A Infinite {scoresA.infinitePct.toFixed(1)}% • B Infinite {scoresB.infinitePct.toFixed(1)}%
              </div>
              <div className="rounded-xl border border-smoke2 bg-black/20 px-3 py-2">
                A Banana {scoresA.bananaPct.toFixed(1)}% • B Banana {scoresB.bananaPct.toFixed(1)}%
              </div>
            </div>
          </div>
        ) : null}

        {state.mode === "solo" && shareUrl ? (
          <div className="mt-5 space-y-3">
            <div className="text-xs font-semibold text-ink/70">Summon User B</div>
            <div className="rounded-xl border border-smoke2 bg-black/25 px-4 py-3 text-xs break-all text-ink/75">
              {shareUrl}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button tone="banana" onClick={copyLink}>
                <Copy size={18} /> {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                tone="ghost"
                onClick={() => {
                  if (!shareUrl) return;
                  window.open(shareUrl, "_blank");
                }}
              >
                <Link2 size={18} /> Open
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="flex gap-3">
        <Button tone="ghost" className="flex-1" onClick={() => dispatch({ type: "restart" })}>
          <RotateCcw size={18} /> Restart
        </Button>
      </div>
    </div>
  );
}

