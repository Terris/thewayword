import { type Id, api } from "@repo/convex";
import { Topography } from "@repo/ui";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useState } from "react";

export function AdventureLogCoverImage({
  adventureLogId,
  className,
}: {
  adventureLogId: Id<"adventureLogs">;
  className?: string;
}) {
  const [imageIsLoaded, setImageIsLoaded] = useState(false);
  const coverImageFile = useQuery(
    api.adventureLogBlocks.findCoverImageByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const isLoading = coverImageFile === undefined;

  if (isLoading) return null;
  if (!coverImageFile)
    return <Topography className="bg-neutral-100 fill-foreground" />;

  return (
    <>
      <Image
        src={coverImageFile?.url ?? "/img/tww-fallback-cover.png"}
        alt="Log Cover Image"
        // width={coverImageFile.dimensions?.width}
        // height={coverImageFile.dimensions?.height}
        sizes="auto"
        fill
        className={cn("rounded object-cover w-full bg-neutral-100", className)}
        onLoadingComplete={() => setImageIsLoaded(true)}
      />
      {!imageIsLoaded && (
        <Topography className="bg-neutral-100 fill-foreground animate-pulse" />
      )}
    </>
  );
}
