import { GalleryThumbnails } from "lucide-react";
import { useToast } from "@repo/ui/hooks";
import { useMutation } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Button } from "@repo/ui";

interface UploadButtonProps {
  adventureLogId: Id<"adventureLogs">;
}

export function AddGalleryBlockButton({ adventureLogId }: UploadButtonProps) {
  const { toast } = useToast();
  const addGalleryWithBlock = useMutation(
    api.galleries.createAsAdventureLogOwner
  );

  async function handleAddGalleryBlock() {
    try {
      await addGalleryWithBlock({
        adventureLogId,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Something went wrong trying to add a gallery block. Please try again.",
      });
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          void handleAddGalleryBlock();
        }}
      >
        <GalleryThumbnails className="w-4 h-4" />
      </Button>
    </>
  );
}

export interface ImageDimensions {
  width?: number;
  height?: number;
}
