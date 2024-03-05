import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { AspectRatio } from "@repo/ui/AspectRatio";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";

export function AdventureLogShowcaseImage({
  showcaseFileId,
  className,
}: {
  showcaseFileId?: Id<"files">;
  className?: string;
}) {
  const queryArgs = showcaseFileId ? { id: showcaseFileId } : "skip";

  const file = useQuery(api.files.findById, queryArgs);
  const isLoading = file === undefined;

  if (!showcaseFileId || (!isLoading && file === null)) return null;
  if (isLoading) return <LoadingBox />;
  return (
    <AspectRatio ratio={4 / 3} className="rounded">
      <Image
        src={file.url}
        alt={file.fileName}
        objectFit="cover"
        layout="fill"
        className={cn("rounded object-fill", className)}
      />
    </AspectRatio>
  );
}
