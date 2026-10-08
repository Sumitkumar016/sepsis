import React from "react";

export function CardHeader({ children, className = "", border = false }) {
  return (
    <div
      className={`p-4 sm:p-5 flex items-center justify-between gap-3 ${
        border ? "border-b border-[#E2E8F0] dark:border-[#273449]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", icon: Icon = null }) {
  return (
    <h3
      className={`text-xs sm:text-sm font-bold tracking-tight text-[#172033] dark:text-[#F8FAFC] flex items-center gap-2 ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 text-[#14B87A] dark:text-[#35D39A] shrink-0" />}
      <span>{children}</span>
    </h3>
  );
}

export function CardDescription({ children, className = "" }) {
  return (
    <p className={`text-[11px] sm:text-xs text-[#526174] dark:text-[#94A3B8] mt-0.5 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "", border = true }) {
  return (
    <div
      className={`p-4 sm:p-5 ${
        border ? "border-t border-[#E2E8F0] dark:border-[#273449]" : ""
      } flex items-center justify-between gap-3 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#273449] rounded-2xl shadow-xs transition-all duration-200 ${
        hover ? "hover:shadow-sm hover:border-[#CBD5E1] dark:hover:border-[#384860]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
