import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const variantClasses: Record<string, string> = {
  default: "bg-blue-100 text-blue-800 border-blue-200",
  secondary: "bg-gray-100 text-gray-800 border-gray-200",
  destructive: "bg-red-100 text-red-800 border-red-200",
  outline: "bg-white text-gray-700 border-gray-300",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
