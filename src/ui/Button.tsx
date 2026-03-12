import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "pink" | "banana" | "ghost";
};

export function Button({ tone = "pink", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    tone === "pink"
      ? "bg-pink text-navy shadow-neon border border-banana hover:brightness-110"
      : tone === "banana"
        ? "bg-banana text-navy shadow-banana border border-banana/70 hover:brightness-105"
        : "bg-smoke border border-smoke2 text-ink hover:bg-smoke2";
  return <button className={`${base} ${styles} ${className}`} {...props} />;
}

