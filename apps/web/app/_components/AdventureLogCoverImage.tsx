import { type Id, api } from "@repo/convex";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";

export function AdventureLogCoverImage({
  adventureLogId,
  className,
}: {
  adventureLogId: Id<"adventureLogs">;
  className?: string;
}) {
  const coverImageFile = useQuery(
    api.adventureLogBlocks.findCoverImageByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const isLoading = coverImageFile === undefined;

  if (isLoading) return null;

  return (
    <Image
      src={coverImageFile?.url ?? "/img/tww-fallback-cover.png"}
      alt="Log Cover Image"
      // width={coverImageFile.dimensions?.width}
      // height={coverImageFile.dimensions?.height}
      sizes="auto"
      fill
      className={cn("rounded object-cover w-full", className)}
    />
  );
}
