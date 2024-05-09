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
  const coverImageFile = useQuery(
    api.adventureLogBlocks.findCoverImageByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const isLoading = coverImageFile === undefined;

  const coverImageFileWithBackup = coverImageFile ?? {
    url: "/img/default-log-cover.jpg",
    fileName: "default-log-cover.jpg",
  };

  if (isLoading) return <LoadingBox />;

  return (
    <AspectRatio ratio={1.25 / 1} className={cn(className)}>
      <Image
        src={coverImageFileWithBackup.url}
        alt={coverImageFileWithBackup.fileName}
        objectFit="cover"
        layout="fill"
        className="rounded object-cover"
      />
    </AspectRatio>
  );
}
