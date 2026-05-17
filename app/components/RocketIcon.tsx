"use client";

interface RocketIconProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function RocketIcon({ size = 20, animate = false, className = "" }: RocketIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animate ? "animate-rocket" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 2C12 2 7 6 7 13L9.5 15.5C10 12 11 9 12 2Z"
        stroke="#D81B60"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M12 2C12 2 17 6 17 13L14.5 15.5C14 12 13 9 12 2Z"
        stroke="#D81B60"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="10" r="2" stroke="#D81B60" strokeWidth="1.5" fill="none" />
      <path
        d="M9.5 15.5L8 18L10.5 17L12 20L13.5 17L16 18L14.5 15.5"
        stroke="#D81B60"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M7 13C5 13 4 15 4 17C6 17 7.5 16 9.5 15.5"
        stroke="#EC407A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 13C19 13 20 15 20 17C18 17 16.5 16 14.5 15.5"
        stroke="#EC407A"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
