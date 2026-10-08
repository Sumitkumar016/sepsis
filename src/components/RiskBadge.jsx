import React from "react";

export default function RiskBadge({
  level = "Safe",
  score = null,
  size = "md",
  showDot = true,
  className = "",
}) {
  const normalizedLevel = String(level || "Low").toLowerCase();

  const isHigh = normalizedLevel.includes("high") || (score !== null && score >= 80);
  const isMedium = normalizedLevel.includes("medium") || (score !== null && score >= 50 && score < 80);
  const isLow = !isHigh && !isMedium;

  const config = isHigh
    ? {
        label: "High Risk",
        badgeClasses:
          "bg-[#FEF2F2] text-[#DC2626] border-[#F5B5B5] dark:bg-[#2A1517] dark:text-[#F87171] dark:border-[#4C1D24]",
        dotClasses: "bg-[#DC2626]",
      }
    : isMedium
    ? {
        label: "Medium Risk",
        badgeClasses:
          "bg-[#FFF7E6] text-[#B45309] border-[#F5D08A] dark:bg-[#2A1F11] dark:text-[#FBBF24] dark:border-[#523B19]",
        dotClasses: "bg-[#B45309]",
      }
    : {
        label: "Low Risk",
        badgeClasses:
          "bg-[#ECFDF3] text-[#15803D] border-[#BBE7C8] dark:bg-[#102419] dark:text-[#34D399] dark:border-[#1E432E]",
        dotClasses: "bg-[#15803D]",
      };

  const displayLabel = level || config.label;

  const sizeClasses = {
    xs: "px-2 py-0.5 text-[10px] gap-1",
    sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
    md: "px-3 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  }[size] || "px-2.5 py-0.5 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-2xs select-none transition-colors ${config.badgeClasses} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClasses} ${
            isHigh ? "animate-pulse" : ""
          }`}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
      {score !== null && (
        <span className="font-mono opacity-80 font-normal">({score}%)</span>
      )}
    </span>
  );
}
