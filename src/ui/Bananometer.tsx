import { motion } from "framer-motion";
import React from "react";

export function Bananometer({ bananaPct }: { bananaPct: number }) {
  const pct = Math.min(100, Math.max(0, bananaPct));
  const needle = -110 + (220 * pct) / 100;

  const label =
    pct >= 66 ? "Over-Ripe" : pct >= 33 ? "Bruising" : pct >= 15 ? "A Little Green" : "Fresh";

  const r = 56;
  const cx = 64;
  const cy = 64;
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const arcLen = Math.PI * r; // semicircle length
  const filled = (pct / 100) * arcLen;

  return (
    <div className="rounded-xl2 border border-smoke2 bg-black/20 px-5 py-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold tracking-wide text-banana">BANANOMETER</div>
        <div className="text-xs text-ink/70">{label}</div>
      </div>

      <div className="rounded-xl border border-smoke2 bg-black/15 px-4 py-4">
        <div className="flex items-baseline justify-between">
          <div className="text-xs text-ink/60">Red-Flag Weather (Authoritarian / Erasure / DARVO)</div>
          <div className="text-sm font-black tabular-nums text-ink">
            {pct.toFixed(1)}% <span className="text-ink/60 font-semibold">banana</span>
          </div>
        </div>

        <div className="mt-3 relative">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-banana/10 via-pink/10 to-banana/10" />
          <div className="relative flex items-center justify-center py-3">
            <svg width="100%" viewBox="0 0 128 80" className="max-w-[520px]">
              <defs>
                <linearGradient id="bananaGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffe135" stopOpacity="0.95" />
                  <stop offset="55%" stopColor="#ff007f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffe135" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* track */}
              <path
                d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
                fill="none"
                stroke="rgba(231, 238, 252, 0.22)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* fill */}
              <path
                d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
                fill="none"
                stroke="url(#bananaGrad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${filled} ${arcLen}`}
              />
            </svg>

            <motion.div
              className="absolute left-1/2 bottom-[14px] w-[2px] h-20 bg-banana origin-bottom shadow-banana z-20"
              style={{ translateX: "-50%" }}
              animate={{ rotate: needle }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
            />
            <div className="absolute left-1/2 bottom-[14px] w-3 h-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-pink shadow-neon z-20" />
          </div>

          <div className="relative mt-1 flex items-center justify-between text-xs text-ink/70">
            <span>Empathy</span>
            <span>Power</span>
          </div>
        </div>
      </div>
    </div>
  );
}

