import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon, LayoutPanelLeft } from "lucide-react";
import { Doc, api, type Id } from "@repo/convex";
import { useDebounce } from "@repo/hooks";
import { Button, Input, LoadingBox, Text } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useBlockEditorContext } from "./BlockEditorContext";

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
      <div className="w-full flex flex-col">
        <div className="w-full min-h-[160px]">
          <EditableGalleryLayout gallery={gallery} isSelected={isSelected} />
        </div>
        {caption ? <Text className="text-sm py-1">{caption}</Text> : null}
      </div>
      {isSelected ? (
        <div className="absolute bg-background p-4 rounded-lg shadow">
          <div className="flex items-center justify-center gap-2 pb-2">
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
          </div>
          <Input
            placeholder="Add an image caption"
            value={updatedCaption}
            onChange={(e) => {
              setUpdatedCaption(e.currentTarget.value);
            }}
          />
        </div>
      ) : null}
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

  return (
    <>
      {gallery.layout === "1x2" ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-100 rounded w-full h-full min-h-[600px]">
            {image1 && image1.fileId ? (
              <GalleryImage fileId={image1.fileId} />
            ) : (
              <>
                {isSelected && (
                  <UploadFileButton
                    onSuccess={(fileIds) =>
                      handleAddGalleryImage({ order: 0, fileIds })
                    }
                    className="w-full h-full"
                    uniqueId="gallery-image-1"
                  >
                    Upload new image
                  </UploadFileButton>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="w-full h-1/2 bg-neutral-100 rounded">
              {image2 && image2.fileId ? (
                <GalleryImage fileId={image2.fileId} />
              ) : (
                <>
                  {isSelected && (
                    <UploadFileButton
                      onSuccess={(fileIds) =>
                        handleAddGalleryImage({ order: 1, fileIds })
                      }
                      className="w-full h-full"
                      uniqueId="gallery-image-2"
                    >
                      Upload new image
                    </UploadFileButton>
                  )}
                </>
              )}
            </div>
            <div className="w-full h-1/2 bg-neutral-100 rounded">
              {image3 && image3.fileId ? (
                <GalleryImage fileId={image3.fileId} />
              ) : (
                <>
                  {isSelected && (
                    <UploadFileButton
                      onSuccess={(fileIds) =>
                        handleAddGalleryImage({ order: 2, fileIds })
                      }
                      className="w-full h-full"
                      uniqueId="gallery-image-3"
                    >
                      Upload new image
                    </UploadFileButton>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {gallery.layout === "2x1" ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 overflow-hidden">
            <div className="w-full h-1/2 bg-neutral-100 rounded">
              {image2 && image2.fileId ? (
                <GalleryImage fileId={image2.fileId} />
              ) : (
                <>
                  {isSelected && (
                    <UploadFileButton
                      onSuccess={(fileIds) =>
                        handleAddGalleryImage({ order: 1, fileIds })
                      }
                      className="w-full h-full"
                      uniqueId="gallery-image-2"
                    >
                      Upload new image
                    </UploadFileButton>
                  )}
                </>
              )}
            </div>
            <div className="w-full h-1/2 bg-neutral-100 rounded">
              {image3 && image3.fileId ? (
                <GalleryImage fileId={image3.fileId} />
              ) : (
                <>
                  {isSelected && (
                    <UploadFileButton
                      onSuccess={(fileIds) =>
                        handleAddGalleryImage({ order: 2, fileIds })
                      }
                      className="w-full h-full"
                      uniqueId="gallery-image-3"
                    >
                      Upload new image
                    </UploadFileButton>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="bg-neutral-100 rounded w-full h-full min-h-[600px]">
            {image1 && image1.fileId ? (
              <GalleryImage fileId={image1.fileId} />
            ) : (
              <>
                {isSelected && (
                  <UploadFileButton
                    onSuccess={(fileIds) =>
                      handleAddGalleryImage({ order: 0, fileIds })
                    }
                    className="w-full h-full"
                    uniqueId="gallery-image-1"
                  >
                    Upload new image
                  </UploadFileButton>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
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
