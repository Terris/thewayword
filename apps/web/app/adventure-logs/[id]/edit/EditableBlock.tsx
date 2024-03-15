import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { MoveDown, MoveUp, Trash2 } from "lucide-react";
import { api, type Doc } from "@repo/convex";
import { cn } from "@repo/utils";
import { EditableTextBlock } from "./EditableTextBlock";
import { EditableImageBlock } from "./EditableImageBlock";

export function EditableBlock({ block }: { block: Doc<"adventureLogBlocks"> }) {
  const [selected, setSelected] = useState(false);
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
    if (!selected && canUpdateBlock) {
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
    selected,
    updateAdventureLogBlock,
    updatedContent,
    updatedFileId,
  ]);

  return (
    <>
      {selected ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-1"
          onClick={() => {
            setSelected(false);
          }}
          onKeyUp={() => {
            setSelected(false);
          }}
          role="button"
          tabIndex={0}
        />
      ) : null}

      <div
        className={cn(
          "relative z-10 w-full border-2 border-dashed border-transparent rounded flex items-center justify-center transition-all",
          selected ? "border-primary p-4" : "hover:border-muted"
        )}
        onClick={() => {
          setSelected(true);
        }}
        onKeyUp={() => {
          setSelected(true);
        }}
        role="button"
        tabIndex={0}
      >
        {block.type === "image" && block.fileId ? (
          <EditableImageBlock
            selected={selected}
            fileId={updatedFileId}
            setFileId={(fileId) => {
              setUpdatedFileId(fileId);
            }}
          />
        ) : (
          <EditableTextBlock
            selected={selected}
            content={updatedContent}
            setContent={setUpdatedContent}
          />
        )}
        {selected ? (
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
