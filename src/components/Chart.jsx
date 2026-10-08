import React from "react";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

export default function ChartContainer({
  title,
  subtitle,
  action,
  children,
  height = "h-48",
  isLoading = false,
  className = "",
}) {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      {(title || subtitle || action) && (
        <CardHeader className="pb-2">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}

      <CardContent className="pt-1">
        {isLoading ? (
          <div className={`w-full ${height} bg-[#F1F5F9] dark:bg-[#1E293B] rounded-xl animate-pulse flex items-center justify-center text-xs text-[#7A8798] dark:text-[#94A3B8]`}>
            Loading analytics...
          </div>
        ) : (
          <div className={`w-full ${height} relative`}>{children}</div>
        )}
      </CardContent>
    </Card>
  );
}
