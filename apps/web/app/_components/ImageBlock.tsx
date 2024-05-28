import Image from "next/image";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { cn } from "@repo/utils";

export function ImageBlock({
  fileId,
  className,
  caption,
}: {
  fileId: Id<"files">;
  className?: string;
  caption?: string;
}) {
  const file = useQuery(api.files.findById, { id: fileId });
  if (!file) return null;
  return (
    <div className="my-4">
      <Image
        src={file.url}
        width={file.dimensions?.width}
        height={file.dimensions?.height}
        alt="Adventure log image"
        className={cn("mx-auto rounded object-contain", className)}
      />
      {caption ? (
        <Text className="text-sm text-neutral-400 py-1">{caption}</Text>
      ) : null}
    </div>
  );
}
