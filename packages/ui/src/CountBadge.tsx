import { cn } from "@repo/utils";

export function CountBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full border text-xs font-bold text-foreground bg-background w-6 h-6 flex items-center justify-center",
        className
      )}
    >
      {count}
    </div>
  );
}
