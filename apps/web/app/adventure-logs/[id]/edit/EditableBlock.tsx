import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { MoveDown, MoveUp, Trash2 } from "lucide-react";
import { api, type Doc } from "@repo/convex";
import { cn } from "@repo/utils";
import { ImageBlockDisplaySizeWrapper } from "../../../_components/ImageBlockDisplaySizeWrapper";
import { EditableTextBlock } from "./EditableTextBlock";
import { EditableImageBlock } from "./EditableImageBlock";
import { useBlockEditorContext } from "./BlockEditorContext";

export function EditableBlock({
  block,
  setIsSaving,
}: {
  block: Doc<"adventureLogBlocks">;
  setIsSaving: (value: boolean) => void;
}) {
  const thisBlockId = block._id;
  const { editingBlockId, setEditingBlockId } = useBlockEditorContext();
  const isSelected = editingBlockId === thisBlockId;

  const [updatedContent, setUpdatedContent] = useState(block.content);
  const [updatedFileId, setUpdatedFileId] = useState(block.fileId);

  const canUpdateBlock = updatedContent !== block.content;

  const updateAdventureLogBlock = useMutation(api.adventureLogBlocks.update);

  const moveBlockOrderUp = useMutation(api.adventureLogBlocks.moveBlockOrderUp);
  const moveBlockOrderDown = useMutation(
    api.adventureLogBlocks.moveBlockOrderDown
  );

  const deleteAdventureLogBlock = useMutation(api.adventureLogBlocks.destroy);

  // Attempt to save updated block when block is deselected
  useEffect(() => {
    if (!isSelected && canUpdateBlock) {
      setIsSaving(true);
      void updateAdventureLogBlock({
        id: block._id,
        content:
          updatedContent !== block.content ? updatedContent : block.content,
        fileId: updatedFileId !== block.fileId ? updatedFileId : block.fileId,
      });
    }
  }, [
    block._id,
    block.content,
    block.fileId,
    canUpdateBlock,
    isSelected,
    updateAdventureLogBlock,
    updatedContent,
    updatedFileId,
    setIsSaving,
  ]);

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
          isSelected ? "border-primary p-4" : "hover:border-muted"
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
              fileId={updatedFileId}
              setFileId={(fileId) => {
                setUpdatedFileId(fileId);
              }}
            />
          </ImageBlockDisplaySizeWrapper>
        ) : (
          <EditableTextBlock
            isSelected={isSelected}
            content={updatedContent}
            setContent={setUpdatedContent}
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
