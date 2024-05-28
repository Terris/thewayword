import { Type } from "lucide-react";
import { useMutation } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Button } from "@repo/ui";

interface UploadButtonProps {
  adventureLogId: Id<"adventureLogs">;
}

export function AddTextBlockButton({ adventureLogId }: UploadButtonProps) {
  const addTextBlock = useMutation(api.adventureLogBlocks.create);

  return (
    <Button
      onClick={() =>
        void addTextBlock({
          adventureLogId,
          type: "text",
          content: "",
        })
      }
    >
      <Type className="w-4 h-4" />
    </Button>
  );
}

export interface ImageDimensions {
  width?: number;
  height?: number;
}
