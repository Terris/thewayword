import { type ReactNode } from "react";
import { cn } from "@repo/utils";

export function ImageBlockDisplaySizeWrapper({
  displaySize,
  children,
}: {
  displaySize?: "small" | "medium" | "large";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "w-full mx-auto transition-all",
        displaySize === "small" && "w-[600px]",
        displaySize === "medium" && "w-[900px]",
        displaySize === "large" && "w-full"
      )}
    >
      {children}
    </div>
  );
}
