"use client";

const DOTS = [
  { top: "8%", left: "5%", delay: "0s", size: 2 },
  { top: "15%", left: "18%", delay: "0.4s", size: 1.5 },
  { top: "25%", left: "35%", delay: "0.8s", size: 2 },
  { top: "12%", left: "55%", delay: "1.2s", size: 1.5 },
  { top: "30%", left: "72%", delay: "0.6s", size: 2.5 },
  { top: "45%", left: "88%", delay: "0.3s", size: 1.5 },
  { top: "60%", left: "8%", delay: "1s", size: 2 },
  { top: "70%", left: "25%", delay: "0.5s", size: 1.5 },
  { top: "55%", left: "48%", delay: "1.4s", size: 2 },
  { top: "80%", left: "62%", delay: "0.7s", size: 1.5 },
  { top: "65%", left: "80%", delay: "0.2s", size: 2 },
  { top: "88%", left: "42%", delay: "0.9s", size: 1.5 },
  { top: "5%", left: "80%", delay: "1.1s", size: 2 },
  { top: "40%", left: "15%", delay: "1.3s", size: 1.5 },
  { top: "90%", left: "90%", delay: "0.6s", size: 2 },
];

export function Constellation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            background: "#D81B60",
            opacity: 0.4,
            animation: `twinkle 2.5s ease-in-out ${dot.delay} infinite`,
          }}
        />
      ))}
      {/* Curva de órbita */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.06 }}
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <path
          d="M -100 600 Q 400 100 900 400 Q 1200 600 1600 200"
          stroke="#D81B60"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M -100 200 Q 300 500 700 300 Q 1100 100 1600 500"
          stroke="#EC407A"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
}
