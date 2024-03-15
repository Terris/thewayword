import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { MoveDown, MoveUp, Trash2 } from "lucide-react";
import { api, type Id } from "@repo/convex";
import { cn } from "@repo/utils";
import { EditableTextBlock } from "./EditableTextBlock";
import { EditableImageBlock } from "./EditableImageBlock";

interface Block {
  type: "text" | "image";
  order: number;
  content: string;
  fileId?: Id<"files">;
}

interface EditableBlockProps {
  adventureLogId: Id<"adventureLogs">;
  block: Block;
  blockIndex: number;
}

export function EditableBlock({
  adventureLogId,
  block,
  blockIndex,
}: EditableBlockProps) {
  const [selected, setSelected] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(block.content);
  const [updatedFileId, setUpdatedFileId] = useState(block.fileId);

  const canUpdateBlock = updatedContent !== block.content;

  const updateAdventureLog = useMutation(
    api.adventureLogs.updateAdventureLogBlock
  );

  const moveBlockUp = useMutation(api.adventureLogs.moveBlockUp);
  const moveBlockDown = useMutation(api.adventureLogs.moveBlockDown);

  const deleteAdventureLogBlock = useMutation(api.adventureLogs.deleteBlock);

  // Attempt to save updated block when block is deselected
  useEffect(() => {
    if (!selected && canUpdateBlock) {
      void updateAdventureLog({
        adventureLogId,
        blockIndex,
        content:
          updatedContent !== block.content ? updatedContent : block.content,
        fileId: updatedFileId !== block.fileId ? updatedFileId : block.fileId,
      });
    }
  }, [
    selected,
    canUpdateBlock,
    updateAdventureLog,
    adventureLogId,
    blockIndex,
    updatedContent,
    block.content,
    block.fileId,
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
              onClick={() => moveBlockUp({ adventureLogId, blockIndex })}
            >
              <MoveUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="w-4 h-4"
              onClick={() => moveBlockDown({ adventureLogId, blockIndex })}
            >
              <MoveDown className="w-4 h-4 hover:text-primary" />
            </button>
            <hr />
            <button type="button" className="w-4 h-4 hover:text-primary">
              <Trash2
                className="w-4 h-4"
                onClick={() =>
                  deleteAdventureLogBlock({ adventureLogId, blockIndex })
                }
              />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
