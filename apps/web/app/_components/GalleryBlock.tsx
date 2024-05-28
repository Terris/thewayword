import Image from "next/image";
import { useQuery } from "convex/react";
import { Doc, api, type Id } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { cn } from "@repo/utils";

export function GalleryBlock({
  galleryId,
  caption,
}: {
  galleryId: Id<"galleries">;
  caption?: string;
}) {
  const gallery = useQuery(api.galleries.findById, { id: galleryId });
  const isLoading = gallery === undefined;

  if (isLoading) return <LoadingBox />;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col">
        <div className="w-full min-h-[160px]">
          <GalleryLayout gallery={gallery} />
        </div>
        {caption ? <Text className="text-sm py-1">{caption}</Text> : null}
      </div>
    </div>
  );
}

function GalleryLayout({ gallery }: { gallery: Doc<"galleries"> }) {
  const image1 = gallery.images?.find((image) => image.order === 0);
  const image2 = gallery.images?.find((image) => image.order === 1);
  const image3 = gallery.images?.find((image) => image.order === 2);
  if (gallery.layout === "1x2" || gallery.layout === "2x1") {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            "w-full h-full md:min-h-[300px]",
            gallery.layout === "1x2" && "order-first",
            gallery.layout === "2x1" && "order-last"
          )}
        >
          {image1 && image1.fileId ? (
            <GalleryImage fileId={image1.fileId} />
          ) : null}
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full h-1/2">
            {image2 && image2.fileId ? (
              <GalleryImage fileId={image2.fileId} />
            ) : null}
          </div>
          <div className="w-full h-1/2">
            {image3 && image3.fileId ? (
              <GalleryImage fileId={image3.fileId} />
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        image2?.fileId && "grid-cols-2",
        image3?.fileId && "grid-cols-3"
      )}
    >
      <div className="w-full h-full">
        {image1 && image1.fileId ? (
          <GalleryImage fileId={image1.fileId} />
        ) : null}
      </div>
      <div className="w-full h-full">
        {image2?.fileId ? <GalleryImage fileId={image2.fileId} /> : null}
      </div>
      <div className="w-full h-full">
        {image3?.fileId ? <GalleryImage fileId={image3.fileId} /> : null}
      </div>
    </div>
  );
}

function GalleryImage({ fileId }: { fileId: Id<"files"> }) {
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
      className="mx-auto rounded object-cover h-full w-full"
    />
  );
}
