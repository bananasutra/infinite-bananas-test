import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-smoke2 bg-smoke backdrop-blur px-5 py-5 shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}

