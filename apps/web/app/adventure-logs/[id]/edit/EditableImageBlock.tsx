import Image from "next/image";
import { useQuery } from "convex/react";
import { ImageIcon } from "lucide-react";
import { api, type Id } from "@repo/convex";
import { Button, LoadingBox } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useBlockEditorContext } from "./BlockEditorContext";

export function EditableImageBlock({
  isSelected,
  fileId,
  setFileId,
}: {
  isSelected: boolean;
  fileId?: Id<"files">;
  setFileId: (value: Id<"files">) => void;
}) {
  const { handleUpdateBlock } = useBlockEditorContext();
  const fileQueryArgs = fileId ? { id: fileId } : "skip";
  const file = useQuery(api.files.findById, fileQueryArgs);
  const isLoading = file === undefined;

  if (isLoading) return <LoadingBox />;
  if (!file || !fileId) return null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex">
        <Image
          src={file.url}
          width={file.dimensions?.width}
          height={file.dimensions?.height}
          alt="Adventure log image"
          className="mx-auto rounded"
        />
      </div>
      {isSelected ? (
        <div className="absolute flex items-center justify-center gap-2 bg-background p-4 rounded-lg">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleUpdateBlock({ values: { displaySize: "small" } });
            }}
          >
            <ImageIcon size={12} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleUpdateBlock({ values: { displaySize: "medium" } });
            }}
          >
            <ImageIcon size={18} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              handleUpdateBlock({ values: { displaySize: "large" } });
            }}
          >
            <ImageIcon size={24} />
          </Button>
          <UploadFileButton
            onSuccess={(fileIds) => {
              if (!fileIds[0]) return;
              setFileId(fileIds[0]);
            }}
          >
            Upload new image
          </UploadFileButton>
        </div>
      ) : null}
    </div>
  );
}
