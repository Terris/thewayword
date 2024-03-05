import { type Id } from "@repo/convex";
import { ImageBlock } from "./ImageBlock";
import { TextBlock } from "./TextBlock";

interface BlockProps {
  block: {
    type: "text" | "image";
    order: number;
    content: string;
    fileId?: Id<"files">;
  };
}

export function Block({ block }: BlockProps) {
  return (
    <div className="rounded">
      {block.type === "image" && block.fileId ? (
        <ImageBlock fileId={block.fileId} />
      ) : (
        <TextBlock content={block.content} />
      )}
    </div>
  );
}
