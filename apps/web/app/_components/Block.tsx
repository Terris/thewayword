import { type Doc } from "@repo/convex";
import { ImageBlock } from "./ImageBlock";
import { TextBlock } from "./TextBlock";
import { ImageBlockDisplaySizeWrapper } from "./ImageBlockDisplaySizeWrapper";
import { GalleryBlock } from "./GalleryBlock";

export function Block({ block }: { block: Doc<"adventureLogBlocks"> }) {
  return (
    <div className="rounded">
      {block.type === "text" && block.content ? (
        <TextBlock content={block.content} />
      ) : null}
      {block.type === "image" && block.fileId ? (
        <ImageBlockDisplaySizeWrapper displaySize={block.displaySize}>
          <ImageBlock fileId={block.fileId} caption={block.caption} />
        </ImageBlockDisplaySizeWrapper>
      ) : null}
      {block.type === "gallery" && block.galleryId ? (
        <ImageBlockDisplaySizeWrapper displaySize={block.displaySize}>
          <GalleryBlock galleryId={block.galleryId} caption={block.caption} />
        </ImageBlockDisplaySizeWrapper>
      ) : null}
    </div>
  );
}
