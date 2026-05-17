interface NumberMegaProps {
  number: string;
  dark?: boolean;
}

export function NumberMega({ number, dark = false }: NumberMegaProps) {
  return (
    <div
      className="absolute top-0 left-0 select-none pointer-events-none leading-none"
      style={{
        fontFamily: "var(--font-playfair)",
        fontSize: "clamp(120px, 18vw, 220px)",
        fontWeight: 900,
        color: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
        lineHeight: 1,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      {number}
    </div>
  );
}
