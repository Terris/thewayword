import Image from "next/image";
import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { UploadFileButton } from "../../../_components/UploadFileButton";

export function EditableImageBlock({
  selected,
  fileId,
  setFileId,
}: {
  selected: boolean;
  fileId?: Id<"files">;
  setFileId: (value: Id<"files">) => void;
}) {
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
      <div className="absolute">
        {selected ? (
          <UploadFileButton
            onSuccess={(fileIds) => {
              if (!fileIds[0]) return;
              setFileId(fileIds[0]);
            }}
          >
            Upload new image
          </UploadFileButton>
        ) : null}
      </div>
    </div>
  );
}
