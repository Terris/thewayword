import { type Id, type Doc, api } from "@repo/convex";
import { useQuery } from "convex/react";
import { LoadingBox } from "@repo/ui";
import { TextBlock } from "./TextBlock";
import { ImageBlockDisplaySizeWrapper } from "./ImageBlockDisplaySizeWrapper";
import { ImageBlock } from "./ImageBlock";
import { GalleryBlock } from "./GalleryBlock";

export function AdventureLogBlocks({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const adventureLogBlocks = useQuery(
    api.adventureLogBlocks.findAllByAdventureLogId,
    {
      adventureLogId,
    }
  );

  const isLoading = adventureLogBlocks === undefined;

  if (isLoading) return <LoadingBox />;

  return adventureLogBlocks.map((block) => (
    <div key={block._id} className="pb-8">
      <Block block={block} />
    </div>
  ));
}

function Block({ block }: { block: Doc<"adventureLogBlocks"> }) {
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
