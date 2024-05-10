import { type Doc } from "@repo/convex";
import { ImageBlock } from "./ImageBlock";
import { TextBlock } from "./TextBlock";
import { ImageBlockDisplaySizeWrapper } from "./ImageBlockDisplaySizeWrapper";

export function Block({ block }: { block: Doc<"adventureLogBlocks"> }) {
  return (
    <div className="rounded">
      {block.type === "image" && block.fileId ? (
        <ImageBlockDisplaySizeWrapper displaySize={block.displaySize}>
          <ImageBlock fileId={block.fileId} />
        </ImageBlockDisplaySizeWrapper>
      ) : (
        <TextBlock content={block.content} />
      )}
    </div>
  );
}
