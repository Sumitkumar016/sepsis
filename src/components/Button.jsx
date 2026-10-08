import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon = null,
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) {
  const variantClasses = {
    primary:
      "bg-[#14B87A] hover:bg-[#0F9F69] active:bg-[#0c8255] text-white shadow-xs focus:ring-2 focus:ring-[#14B87A]/30 border border-[#14B87A]",
    secondary:
      "bg-white hover:bg-[#F8FAFC] dark:bg-[#172033] dark:hover:bg-[#1E293B] text-[#334155] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#273449] shadow-xs",
    outline:
      "bg-white dark:bg-[#172033] border border-[#CBD5E1] dark:border-[#273449] text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] shadow-xs",
    danger:
      "bg-[#DC2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white shadow-xs focus:ring-2 focus:ring-[#DC2626]/30 border border-[#DC2626]",
    ghost:
      "bg-transparent hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#526174] dark:text-[#CBD5E1]",
  }[variant] || "bg-[#14B87A] text-white";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base font-semibold rounded-xl gap-2.5",
  }[size] || "px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl gap-2";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
