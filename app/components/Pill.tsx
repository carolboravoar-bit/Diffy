"use client";

interface PillProps {
  label: string;
  dark?: boolean;
}

export function Pill({ label, dark = false }: PillProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
      style={{
        borderColor: "#D81B60",
        background: "transparent",
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: "#D81B60",
          boxShadow: "0 0 6px rgba(216,27,96,0.7)",
        }}
      />
      <span
        className="text-xs font-semibold tracking-widest uppercase"
        style={{
          fontFamily: "var(--font-inter)",
          color: dark ? "#ffffff" : "#D81B60",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
