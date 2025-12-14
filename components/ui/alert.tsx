import * as React from "react";
import { cn } from "@/lib/utils";

const base =
  "relative w-full rounded-md border px-4 py-3 text-sm flex gap-3";

export type AlertVariant = "info" | "success" | "warning" | "error";

const variantClasses: Record<AlertVariant, string> = {
  info: "border-[color:var(--color-info,#2563EB)] bg-[color:color-mix(in srgb,var(--color-info,#2563EB) 6%,transparent)] text-[color:var(--color-info,#2563EB)]",
  success:
    "border-[color:var(--color-success,#22C55E)] bg-[color:color-mix(in srgb,var(--color-success,#22C55E) 6%,transparent)] text-[color:var(--color-success,#22C55E)]",
  warning:
    "border-[color:var(--color-warning,#F59E0B)] bg-[color:color-mix(in srgb,var(--color-warning,#F59E0B) 6%,transparent)] text-[color:var(--color-warning,#F59E0B)]",
  error:
    "border-destructive bg-[color:color-mix(in srgb,var(--destructive,#DC2626) 6%,transparent)] text-destructive",
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  title,
  description,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(base, variantClasses[variant], className)}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <div className="font-medium mb-0.5">{title}</div>
        )}
        {description && (
          <div className="text-xs opacity-90">{description}</div>
        )}
        {children}
      </div>
    </div>
  );
};
