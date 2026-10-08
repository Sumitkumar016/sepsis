import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "", showLabel = false, size = "md" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "p-1.5 text-xs gap-1.5 rounded-lg",
    md: "p-2 text-sm gap-2 rounded-xl",
    lg: "p-2.5 text-base gap-2.5 rounded-xl",
  }[size] || "p-2 text-sm gap-2 rounded-xl";

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  }[size] || "w-4.5 h-4.5";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 border cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#14B87A]/30 ${
        isDark
          ? "bg-[#172033] hover:bg-[#1E293B] text-amber-300 border-[#273449] shadow-xs"
          : "bg-white hover:bg-[#F8FAFC] text-[#526174] border-[#E2E8F0] shadow-xs"
      } ${sizeClasses} ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className={`${iconSizes} text-amber-400 shrink-0 transition-transform hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSizes} text-[#526174] shrink-0 transition-transform hover:-rotate-12`} />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
