import { ImagePlusIcon } from "lucide-react";
import { useToast } from "@repo/ui/hooks";
import { useMutation } from "convex/react";
import { type Id, api } from "@repo/convex";
import { UploadFileButton } from "../../../_components/UploadFileButton";

interface UploadButtonProps {
  adventureLogId: Id<"adventureLogs">;
}

export function AddImageBlockButton({ adventureLogId }: UploadButtonProps) {
  const { toast } = useToast();
  const addImageBlock = useMutation(api.adventureLogBlocks.create);

  async function handleUploadSuccess(fileIds: Id<"files">[]) {
    if (!fileIds[0]) return;
    try {
      await addImageBlock({
        adventureLogId,
        type: "image",
        fileId: fileIds[0],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Something went wrong trying to upload a file. Please try again.",
      });
    }
  }

  return (
    <UploadFileButton onSuccess={handleUploadSuccess}>
      <ImagePlusIcon className="w-4 h-4" />
    </UploadFileButton>
  );
}

export interface ImageDimensions {
  width?: number;
  height?: number;
}
