import { cn } from "@repo/utils";
import { Loader } from "./Loader";

export function LoadingBox({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center justify-center",
        className
      )}
    >
      <Loader />
    </div>
  );
}
