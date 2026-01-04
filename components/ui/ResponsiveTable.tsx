import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ResponsiveTableRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        `
        border-t
        md:table-row
        block
        p-4
        md:p-0
        space-y-2
        md:space-y-0
        `,
        className
      )}
    >
      {children}
    </tr>
  );
}

export function ResponsiveCell({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <td className={`block md:table-cell md:p-3 md:text-${align}`}>
      <div className="flex justify-between md:block gap-4">
        {/* Mobile label */}
        <span className="md:hidden text-gray-500 font-semibold">
          {label}
        </span>

        {/* Value */}
        <span className="text-right md:text-inherit">
          {children}
        </span>
      </div>
    </td>
  );
}
