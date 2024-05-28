import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { Columns3Icon, ImageIcon, LayoutPanelLeft } from "lucide-react";
import { Doc, api, type Id } from "@repo/convex";
import { useDebounce } from "@repo/hooks";
import { Button, Input, LoadingBox, Text } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useBlockEditorContext } from "./BlockEditorContext";
import { cn } from "@repo/utils";

export function EditableGalleryBlock({
  galleryId,
  caption,
  isSelected,
}: {
  galleryId: Id<"galleries">;
  caption?: string;
  isSelected: boolean;
}) {
  const { handleUpdateBlock } = useBlockEditorContext();
  const [updatedCaption, setUpdatedCaption] = useState(caption);
  const debouncedUpdatedCaption = useDebounce(updatedCaption, 500);
  useEffect(() => {
    if (caption !== debouncedUpdatedCaption) {
      handleUpdateBlock({ caption: debouncedUpdatedCaption });
    }
  }, [caption, debouncedUpdatedCaption, handleUpdateBlock, updatedCaption]);

  const gallery = useQuery(api.galleries.findByIdAsOwner, { id: galleryId });
  const isLoading = gallery === undefined;

  const handleUpdateGallery = useMutation(api.galleries.updateAsOwner);

  if (isLoading) return <LoadingBox />;

  return (
    <div className="flex flex-col items-center justify-center">
      {isSelected ? (
        <div className="absolute top-[-60px] bg-background p-4 rounded-lg shadow">
          <div className=" flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateBlock({ displaySize: "small" });
              }}
            >
              <ImageIcon size={12} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateBlock({ displaySize: "medium" });
              }}
            >
              <ImageIcon size={18} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateBlock({ displaySize: "large" });
              }}
            >
              <ImageIcon size={21} />
            </Button>

            <div className="h-4 border-r border-neutral-400" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateGallery({ galleryId: gallery._id, layout: "1x2" });
              }}
            >
              <LayoutPanelLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateGallery({ galleryId: gallery._id, layout: "2x1" });
              }}
            >
              <LayoutPanelLeft className="w-4 h-4 rotate-180" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateGallery({ galleryId: gallery._id, layout: "row" });
              }}
            >
              <Columns3Icon className="w-4 h-4 rotate-180" />
            </Button>

            <div className="h-4 border-r border-neutral-400" />

            <Input
              placeholder="Add an gallery caption"
              value={updatedCaption}
              onChange={(e) => {
                setUpdatedCaption(e.currentTarget.value);
              }}
            />
          </div>
        </div>
      ) : null}
      <div className="w-full flex flex-col">
        <div className="w-full">
          <EditableGalleryLayout gallery={gallery} isSelected={isSelected} />
        </div>
        {caption ? <Text className="text-sm py-1">{caption}</Text> : null}
      </div>
    </div>
  );
}

function EditableGalleryLayout({
  gallery,
  isSelected,
}: {
  gallery: Doc<"galleries">;
  isSelected: boolean;
}) {
  const image1 = gallery.images?.find((image) => image.order === 0);
  const image2 = gallery.images?.find((image) => image.order === 1);
  const image3 = gallery.images?.find((image) => image.order === 2);

  const updateGalleryImage = useMutation(
    api.galleries.updateGalleryImageAsOwner
  );

  function handleAddGalleryImage({
    fileIds,
    order,
  }: {
    fileIds: Id<"files">[];
    order: number;
  }) {
    if (!fileIds[0]) return;
    updateGalleryImage({ galleryId: gallery._id, order, fileId: fileIds[0] });
  }

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
          ) : (
            <div className="min-h-[200px] bg-neutral-100 rounded w-full h-full">
              {isSelected && (
                <UploadFileButton
                  onSuccess={(fileIds) =>
                    handleAddGalleryImage({ order: 0, fileIds })
                  }
                  className="w-full h-full leading-tight text-center"
                  uniqueId="gallery-image-1"
                  disabled={!isSelected}
                >
                  Select image
                </UploadFileButton>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="w-full h-1/2">
            {image2 && image2.fileId ? (
              <GalleryImage fileId={image2.fileId} />
            ) : (
              <div className="bg-neutral-100 rounded w-full h-full">
                {isSelected && (
                  <UploadFileButton
                    onSuccess={(fileIds) =>
                      handleAddGalleryImage({ order: 1, fileIds })
                    }
                    className="w-full h-full leading-tight text-center"
                    uniqueId="gallery-image-2"
                  >
                    Select image
                  </UploadFileButton>
                )}
              </div>
            )}
          </div>
          <div className="w-full h-1/2">
            {image3 && image3.fileId ? (
              <GalleryImage fileId={image3.fileId} />
            ) : (
              <div className="bg-neutral-100 rounded w-full h-full">
                {isSelected && (
                  <UploadFileButton
                    onSuccess={(fileIds) =>
                      handleAddGalleryImage({ order: 2, fileIds })
                    }
                    className="w-full h-full leading-tight text-center"
                    uniqueId="gallery-image-3"
                  >
                    Select image
                  </UploadFileButton>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        ((isSelected && image1?.fileId) || image2?.fileId) && "grid-cols-2",
        ((isSelected && image2?.fileId) || image3?.fileId) && "grid-cols-3"
      )}
    >
      <div className="w-full h-full">
        {image1 && image1.fileId ? (
          <GalleryImage fileId={image1.fileId} />
        ) : (
          <div className="bg-neutral-100 min-h-[200px] rounded w-full h-full">
            {isSelected && (
              <UploadFileButton
                onSuccess={(fileIds) =>
                  handleAddGalleryImage({ order: 0, fileIds })
                }
                className="w-full h-full min-h-[200px] leading-tight text-center"
                uniqueId="gallery-image-1"
                disabled={!isSelected}
              >
                Select image
              </UploadFileButton>
            )}
          </div>
        )}
      </div>
      {(isSelected && image1?.fileId) || image2?.fileId ? (
        <div className="w-full h-full">
          {image2?.fileId ? (
            <GalleryImage fileId={image2.fileId} />
          ) : (
            <div className="bg-neutral-100 min-h-[200px] rounded w-full h-full">
              {isSelected && (
                <UploadFileButton
                  onSuccess={(fileIds) =>
                    handleAddGalleryImage({ order: 1, fileIds })
                  }
                  className="w-full h-full min-h-[200px] leading-tight text-center"
                  uniqueId="gallery-image-2"
                >
                  Select image
                </UploadFileButton>
              )}
            </div>
          )}
        </div>
      ) : null}
      {(isSelected && image2?.fileId) || image3?.fileId ? (
        <div className="w-full h-full">
          {image3?.fileId ? (
            <GalleryImage fileId={image3.fileId} />
          ) : (
            <div className="bg-neutral-100 min-h-[200px] rounded w-full h-full">
              {isSelected && (
                <UploadFileButton
                  onSuccess={(fileIds) =>
                    handleAddGalleryImage({ order: 2, fileIds })
                  }
                  className="w-full h-full min-h-[200px] leading-tight text-center"
                  uniqueId="gallery-image-3"
                >
                  Select image
                </UploadFileButton>
              )}
            </div>
          )}
        </div>
      ) : null}
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
