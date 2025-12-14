import { cn } from "@/lib/utils";

export function Loader({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-accent border-t-transparent",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
