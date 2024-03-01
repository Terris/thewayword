import Image from "next/image";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";

export function ImageBlock({ fileId }: { fileId: Id<"files"> }) {
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
      className="mx-auto rounded"
    />
  );
}
