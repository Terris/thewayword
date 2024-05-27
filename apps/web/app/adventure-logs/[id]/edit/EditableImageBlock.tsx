import { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { ImageIcon } from "lucide-react";
import { api, type Id } from "@repo/convex";
import { useDebounce } from "@repo/hooks";
import { Button, Input, LoadingBox, Text } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useBlockEditorContext } from "./BlockEditorContext";

export function EditableImageBlock({
  isSelected,
  fileId,
  setFileId,
  caption,
}: {
  isSelected: boolean;
  fileId?: Id<"files">;
  setFileId: (value: Id<"files">) => void;
  caption?: string;
}) {
  const { handleUpdateBlock } = useBlockEditorContext();
  const fileQueryArgs = fileId ? { id: fileId } : "skip";
  const file = useQuery(api.files.findById, fileQueryArgs);
  const isLoading = file === undefined;

  const [updatedCaption, setUpdatedCaption] = useState(caption);
  const debouncedUpdatedCaption = useDebounce(updatedCaption, 500);

  useEffect(() => {
    if (caption !== debouncedUpdatedCaption) {
      handleUpdateBlock({ caption: debouncedUpdatedCaption });
    }
  }, [caption, debouncedUpdatedCaption, handleUpdateBlock, updatedCaption]);

  function handleUpdateFileId(fileIds: Id<"files">[]) {
    if (!fileIds[0] || fileIds[0] === fileId) return;
    handleUpdateBlock({ fileId: fileIds[0] });
  }

  if (isLoading) return <LoadingBox />;
  if (!file || !fileId) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col">
        <Image
          src={file.url}
          width={file.dimensions?.width}
          height={file.dimensions?.height}
          alt="Adventure log image"
          className="mx-auto rounded"
        />
        {caption ? <Text className="text-sm py-1">{caption}</Text> : null}
      </div>
      {isSelected ? (
        <div className="absolute  bg-background p-4 rounded-lg">
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
              <ImageIcon size={24} />
            </Button>
            <UploadFileButton onSuccess={handleUpdateFileId}>
              Upload new image
            </UploadFileButton>
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
