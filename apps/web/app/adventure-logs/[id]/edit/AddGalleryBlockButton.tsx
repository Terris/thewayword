import { LayoutPanelLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { type Id, api } from "@repo/convex";
import { UploadFileButton } from "../../../_components/UploadFileButton";
import { useToast } from "@repo/ui/hooks";

interface AddGalleryBlockButtonProps {
  adventureLogId: Id<"adventureLogs">;
}

export function AddGalleryBlockButton({
  adventureLogId,
}: AddGalleryBlockButtonProps) {
  const { toast } = useToast();
  const addGalleryBlock = useMutation(api.adventureLogBlocks.create);

  async function handleUploadSuccess(fileIds: Id<"files">[]) {
    if (!fileIds.length) return;
    try {
      await addGalleryBlock({
        adventureLogId,
        type: "gallery",
        gallery: {
          fileIds,
          layout: "grid",
        },
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Something went wrong trying to add gallery block. Please try again.",
      });
    }
  }

  return (
    <UploadFileButton onSuccess={handleUploadSuccess} multiple>
      <LayoutPanelLeft className="w-4 h-4" />
    </UploadFileButton>
  );
}
