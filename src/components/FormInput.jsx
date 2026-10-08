import React from "react";
import { AlertCircle } from "lucide-react";

export default function FormInput({
  label,
  error,
  icon: Icon = null,
  helperText,
  id,
  className = "",
  inputClassName = "",
  required = false,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#172033] dark:text-[#F8FAFC] flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-[#DC2626] ml-0.5">*</span>}
          </span>
          {helperText && (
            <span className="text-[11px] font-normal text-[#7A8798] dark:text-[#94A3B8]">{helperText}</span>
          )}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-[#94A3B8]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={inputId}
          required={required}
          className={`w-full rounded-xl border bg-white dark:bg-[#172033] p-2.5 text-xs sm:text-sm text-[#172033] dark:text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all ${
            Icon ? "pl-9" : "px-3"
          } ${
            error
              ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20"
              : "border-[#CBD5E1] dark:border-[#273449] focus:border-[#14B87A] focus:ring-2 focus:ring-[#14B87A]/20"
          } ${inputClassName}`}
          {...props}
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-[#DC2626] text-xs mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
