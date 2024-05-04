import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { AspectRatio } from "@repo/ui/AspectRatio";
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
  const firstImageBlock = useQuery(
    api.adventureLogBlocks.findFirstImageBlockByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const firstImageBlockFileId = firstImageBlock?.fileId;

  const queryArgs = firstImageBlockFileId
    ? { id: firstImageBlockFileId }
    : "skip";

  const file = useQuery(api.files.findById, queryArgs);
  const isLoading = file === undefined;

  if (!firstImageBlockFileId || (!isLoading && file === null)) return null;
  if (isLoading) return <LoadingBox />;

  return (
    <AspectRatio ratio={1.25 / 1} className={cn(className)}>
      <Image
        src={file.url}
        alt={file.fileName}
        objectFit="cover"
        layout="fill"
        className="rounded object-cover"
      />
    </AspectRatio>
  );
}
