import Image from "next/image";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { cn } from "@repo/utils";

export function ImageBlock({
  fileId,
  className,
}: {
  fileId: Id<"files">;
  className?: string;
}) {
  const file = useQuery(api.files.findById, { id: fileId });
  const isLoading = file === undefined;

  if (isLoading) return <LoadingBox />;
  if (!file) return null;

  return (
    <Image
      src={file.url}
      width={file.dimensions?.width}
      height={file.dimensions?.height}
      alt="Adventure log image"
      className={cn("mx-auto rounded", className)}
    />
  );
}
