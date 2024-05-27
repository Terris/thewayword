import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { MoveDown, MoveUp, Trash2 } from "lucide-react";
import { Id, api, type Doc } from "@repo/convex";
import { cn } from "@repo/utils";
import { ImageBlockDisplaySizeWrapper } from "../../../_components/ImageBlockDisplaySizeWrapper";
import { EditableTextBlock } from "./EditableTextBlock";
import { EditableImageBlock } from "./EditableImageBlock";
import { useBlockEditorContext } from "./BlockEditorContext";

export function EditableBlock({ block }: { block: Doc<"adventureLogBlocks"> }) {
  const thisBlockId = block._id;
  const { editingBlockId, setEditingBlockId, handleUpdateBlock } =
    useBlockEditorContext();
  const isSelected = editingBlockId === thisBlockId;

  const moveBlockOrderUp = useMutation(api.adventureLogBlocks.moveBlockOrderUp);
  const moveBlockOrderDown = useMutation(
    api.adventureLogBlocks.moveBlockOrderDown
  );

  const deleteAdventureLogBlock = useMutation(api.adventureLogBlocks.destroy);

  // Attempt to save updated text block when block is deselected
  async function handleUpdateBlockContent(updatedContent: string) {
    if (updatedContent === block.content) return;
    await handleUpdateBlock({
      content: updatedContent,
    });
  }

  // Attempt to save updated image block when new file is uploaded
  async function handleUpdateImageBlockFileId(updatedFileId: Id<"files">) {
    if (updatedFileId !== block.fileId) return;
    await handleUpdateBlock({
      fileId: updatedFileId,
    });
  }

  return (
    <>
      {isSelected ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-1 bg-background opacity-80"
          onClick={() => {
            setEditingBlockId(null);
          }}
          onKeyUp={() => null}
          role="button"
          tabIndex={0}
        />
      ) : null}

      <div
        className={cn(
          "relative z-10 w-full border-2 border-dashed border-transparent rounded flex items-center justify-center transition-all",
          isSelected ? "border-primary p-4" : "hover:border-neutral-400"
        )}
        onClick={() => {
          setEditingBlockId(thisBlockId);
        }}
        onKeyUp={() => null}
        role="button"
        tabIndex={0}
      >
        {block.type === "image" && block.fileId ? (
          <ImageBlockDisplaySizeWrapper displaySize={block.displaySize}>
            <EditableImageBlock
              isSelected={isSelected}
              fileId={block.fileId}
              setFileId={handleUpdateImageBlockFileId}
              caption={block.caption}
            />
          </ImageBlockDisplaySizeWrapper>
        ) : (
          <EditableTextBlock
            isSelected={isSelected}
            content={block.content}
            setContent={handleUpdateBlockContent}
          />
        )}
        {isSelected ? (
          <div className="absolute right-[-17px] bg-foreground text-background p-2 rounded-lg shadow-md flex flex-col gap-2">
            <button
              type="button"
              className="w-4 h-4 hover:text-primary"
              onClick={() => moveBlockOrderUp({ id: block._id })}
            >
              <MoveUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-4 h-4"
              onClick={() => moveBlockOrderDown({ id: block._id })}
            >
              <MoveDown className="w-4 h-4 hover:text-primary" />
            </button>
            <hr />
            <button type="button" className="w-4 h-4 hover:text-primary">
              <Trash2
                className="w-4 h-4"
                onClick={() => deleteAdventureLogBlock({ id: block._id })}
              />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
