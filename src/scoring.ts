import type { Answer, Question, ScoreTally, Trait, UserRun } from "./types";

const bananaTraits: Trait[] = ["authoritarian", "erasure", "strongman", "hierarchy", "dogma", "darvo", "narcissism"];

function emptyTally(): ScoreTally {
  return {
    infinite: 0,
    finite: 0,
    apathy: 0,
    authoritarian: 0,
    erasure: 0,
    strongman: 0,
    hierarchy: 0,
    dogma: 0,
    darvo: 0,
    narcissism: 0,
    grifter: 0,
    gifter: 0,
    shield: 0,
  };
}

function addScores(t: ScoreTally, scores: Partial<Record<Trait, number>>) {
  for (const [k, v] of Object.entries(scores) as Array<[Trait, number]>) {
    t[k] += v ?? 0;
  }
}

// Hand-authored mapping for sliders 41-60: which end is "Infinite" (or Banana etc).
const sliderMap: Record<
  number,
  { min: Partial<Record<Trait, number>>; max: Partial<Record<Trait, number>> }
> = {
  41: { min: { finite: 10 }, max: { infinite: 10, gifter: 5 } },
  42: { min: { infinite: 10 }, max: { hierarchy: 10, finite: 5 } },
  43: { min: { infinite: 10 }, max: { finite: 10, apathy: 5 } },
  44: { min: { authoritarian: 10, finite: 5 }, max: { infinite: 10 } },
  45: { min: { grifter: 5, finite: 10 }, max: { infinite: 10 } },
  46: { min: { infinite: 10, gifter: 5 }, max: { finite: 10, hierarchy: 5 } },
  47: { min: { infinite: 10 }, max: { apathy: 10, finite: 5 } },
  48: { min: { infinite: 10 }, max: { finite: 10, narcissism: 5 } },
  49: { min: { infinite: 10 }, max: { dogma: 10, finite: 5 } },
  50: { min: { finite: 10 }, max: { infinite: 10 } },
  51: { min: { infinite: 10 }, max: { hierarchy: 10, finite: 5 } },
  52: { min: { grifter: 10 }, max: { infinite: 10 } },
  53: { min: { infinite: 10 }, max: { finite: 10 } },
  54: { min: { infinite: 10 }, max: { authoritarian: 10, finite: 5 } },
  55: { min: { infinite: 10 }, max: { erasure: 10, finite: 5 } },
  56: { min: { infinite: 10 }, max: { apathy: 10, finite: 5 } },
  57: { min: { finite: 5 }, max: { infinite: 10, gifter: 5 } },
  58: { min: { infinite: 10 }, max: { finite: 10, hierarchy: 5 } },
  59: { min: { infinite: 10 }, max: { strongman: 10, authoritarian: 5 } },
  60: { min: { finite: 10 }, max: { infinite: 10 } },
};

function lerpScore(
  value01: number,
  minScores: Partial<Record<Trait, number>>,
  maxScores: Partial<Record<Trait, number>>,
): Partial<Record<Trait, number>> {
  const out: Partial<Record<Trait, number>> = {};
  const keys = new Set<Trait>([
    ...(Object.keys(minScores) as Trait[]),
    ...(Object.keys(maxScores) as Trait[]),
  ]);
  keys.forEach((k) => {
    const a = minScores[k] ?? 0;
    const b = maxScores[k] ?? 0;
    out[k] = a + (b - a) * value01;
  });
  return out;
}

export function scoreRun(run: UserRun, questionsById: Record<number, Question>) {
  const tally = emptyTally();
  for (const [idStr, ans] of Object.entries(run.answersById)) {
    const id = Number(idStr);
    const q = questionsById[id];
    if (!q) continue;
    applyAnswerToTally(tally, q, ans);
  }
  const infinite = tally.infinite;
  const finite = tally.finite;
  const banana = bananaTraits.reduce((s, k) => s + tally[k], 0);
  const grifter = tally.grifter;
  const gifter = tally.gifter;
  const totalCore = infinite + finite;
  const infinitePct = totalCore > 0 ? (infinite / totalCore) * 100 : 0;
  const finitePct = totalCore > 0 ? (finite / totalCore) * 100 : 0;
  const bananaPct = totalCore > 0 ? (banana / totalCore) * 100 : 0;
  const griftTotal = grifter + gifter;
  const grifterPct = griftTotal > 0 ? (grifter / griftTotal) * 100 : 0;

  return {
    tally,
    infinitePct,
    finitePct,
    bananaPct,
    grifterPct,
  };
}

export function applyAnswerToTally(tally: ScoreTally, q: Question, ans: Answer) {
  if (q.phase === "swipe" && ans.kind === "swipe") {
    addScores(tally, q.impact[ans.dir]);
    return;
  }
  if (q.phase === "scenario" && ans.kind === "scenario") {
    const opt = q.options[ans.optionIndex];
    if (opt) addScores(tally, opt.scores);
    return;
  }
  if (q.phase === "slider" && ans.kind === "slider") {
    const map = sliderMap[q.id];
    if (!map) return;
    const v01 = Math.min(1, Math.max(0, ans.value / 100));
    addScores(tally, lerpScore(v01, map.min, map.max));
  }
}

export function oracleWeatherReport(a: ReturnType<typeof scoreRun>, b: ReturnType<typeof scoreRun>) {
  const gap = Math.abs(a.infinitePct - b.infinitePct);

  if (a.bananaPct > 50 || b.bananaPct > 50) {
    return {
      title: "🍌 Over-Ripe Alert",
      body:
        "The logic of hierarchy and strongman-worship is present. This suggests a view where empathy is a performance and power is a virtue. This isn't a relationship; it's a power struggle.",
      flags: { highBanana: true, seanWarning: gap > 40 },
    };
  }

  if (gap > 40) {
    return {
      title: "⚡ Severe Storm Warning",
      body:
        "This is the Sean Gap. One seeks Truth, the other seeks Comfort. You will likely feel 'too much' or 'judged' by each other. Proceed only if you both agree to bridge this gap with radical empathy.",
      flags: { highBanana: false, seanWarning: true },
    };
  }

  if (a.infinitePct > 70 && b.infinitePct > 70) {
    return {
      title: "🌈 Infinite Horizon",
      body:
        "You both trade in the currency of Radical Honesty. While others seek 'comfort,' you seek 'growth.' You are co-pilots for the Fascist Storm—your relationship will be intense and beautifully friction-filled.",
      flags: { highBanana: false, seanWarning: false },
    };
  }

  if (a.finitePct > 70 && b.finitePct > 70) {
    return {
      title: "🏠 Buffered Harmony",
      body:
        "Your priority is safety and traditional hangs. You will have a very calm, stable home. Just be careful that your buffered walls don't turn into a prison of silence when the world outside gets loud.",
      flags: { highBanana: false, seanWarning: false },
    };
  }

  return {
    title: "⛅ Mixed Skies",
    body:
      "You two share real overlap, but there are live storm cells in the system. Some values line up; others will rub. Talk about the frictions out loud instead of filing them under 'preferences.' When the stakes are high, choose truth over comfort. When the stakes are low, choose kindness over being right.",
    flags: { highBanana: false, seanWarning: false },
  };
}

