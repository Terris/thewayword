import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
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

  if (isLoading || !coverImageFile) return null;

  return (
    <Image
      src={coverImageFile.url}
      alt={coverImageFile.fileName}
      width={coverImageFile.dimensions?.width}
      height={coverImageFile.dimensions?.height}
      sizes="auto"
      className="rounded object-cover w-full"
    />
  );
}
