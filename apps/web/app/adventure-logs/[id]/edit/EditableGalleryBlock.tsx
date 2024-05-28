import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import {
  ImageIcon,
  ImagePlus,
  LayoutDashboard,
  LayoutGrid,
} from "lucide-react";
import { Doc, api, type Id } from "@repo/convex";
import { useDebounce } from "@repo/hooks";
import { Button, Input, LoadingBox, Text, Topography } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useBlockEditorContext } from "./BlockEditorContext";
import { cn } from "@repo/utils";

interface Gallery {
  fileIds: Id<"files">[];
  layout: "grid" | "masonry";
}

export function EditableGalleryBlock({
  adventureLogBlockId,
  isSelected,
}: {
  adventureLogBlockId: Id<"adventureLogBlocks">;
  isSelected: boolean;
}) {
  const { handleUpdateBlock } = useBlockEditorContext();
  const galleryBlock = useQuery(api.adventureLogBlocks.findById, {
    id: adventureLogBlockId,
  });

  const [updatedCaption, setUpdatedCaption] = useState(
    galleryBlock?.caption ?? ""
  );
  const debouncedUpdatedCaption = useDebounce(updatedCaption, 500);

  useEffect(() => {
    if (galleryBlock?.caption !== debouncedUpdatedCaption) {
      handleUpdateBlock({ caption: debouncedUpdatedCaption });
    }
  }, [
    galleryBlock?.caption,
    debouncedUpdatedCaption,
    handleUpdateBlock,
    updatedCaption,
  ]);

  function handleAddFileId(fileIds: Id<"files">[]) {
    if (!fileIds[0]) return;
    handleUpdateBlock({
      gallery: {
        layout: galleryBlock?.gallery?.layout ?? "grid",
        fileIds: [...(galleryBlock?.gallery?.fileIds ?? []), fileIds[0]],
      },
    });
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col">
        <GalleryBlock adventureLogBlockId={adventureLogBlockId} />
        {galleryBlock?.caption ? (
          <Text className="text-sm py-1">{galleryBlock?.caption}</Text>
        ) : null}
      </div>
      {isSelected ? (
        <div className="absolute bg-background p-4 rounded-lg">
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
            {/* <div className="h-4 border-r border-neutral-400" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateBlock({
                  gallery: {
                    fileIds: [...(galleryBlock?.gallery?.fileIds ?? [])],
                    layout: "grid",
                  },
                });
              }}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleUpdateBlock({
                  gallery: {
                    fileIds: [...(galleryBlock?.gallery?.fileIds ?? [])],
                    layout: "masonry",
                  },
                });
              }}
            >
              <LayoutDashboard size={16} />
            </Button>
            <div className="h-4 border-r border-neutral-400" /> */}
            <UploadFileButton onSuccess={handleAddFileId}>
              Add image
            </UploadFileButton>
          </div>
          <Input
            placeholder="Gallery caption"
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

function GalleryBlock({
  adventureLogBlockId,
}: {
  adventureLogBlockId: Id<"adventureLogBlocks">;
}) {
  const galleryBlock = useQuery(
    api.adventureLogBlocks.findAndForgeGalleryById,
    {
      id: adventureLogBlockId,
    }
  );

  const isLoading = galleryBlock === undefined;

  if (!galleryBlock || isLoading) return null;

  return (
    <div className={cn("grid gap-4 grid-cols-3")}>
      {galleryBlock.gallery?.fileIds.map((fileId) => (
        <EditableGalleryItem key={fileId} fileId={fileId} />
      ))}
    </div>
  );
}

function EditableGalleryItem({
  fileId,
}: {
  fileId: Id<"files">;
  className?: string;
}) {
  const file = useQuery(api.files.findById, { id: fileId });

  if (!file) return null;

  return (
    <div>
      <Image
        src={file.url}
        width={file.dimensions?.width}
        height={file.dimensions?.height}
        alt="Adventure log image"
        className={cn("w-full max-w-full rounded")}
      />
    </div>
  );
}
