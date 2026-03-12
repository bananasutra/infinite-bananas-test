import React from "react";

export function Frame({
  children,
  header,
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-navy text-ink relative overflow-hidden">
      <div className="noise" />
      <div className="mx-auto w-full max-w-2xl px-4 py-6 relative">
        <div className="flex items-center justify-between gap-4 mb-6">{header}</div>
        {children}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

