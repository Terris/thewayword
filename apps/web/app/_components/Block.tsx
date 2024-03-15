import { type Doc } from "@repo/convex";
import { ImageBlock } from "./ImageBlock";
import { TextBlock } from "./TextBlock";

export function Block({ block }: { block: Doc<"adventureLogBlocks"> }) {
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
