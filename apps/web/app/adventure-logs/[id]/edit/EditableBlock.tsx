import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api, type Id } from "@repo/convex";
import { cn } from "@repo/utils";
import { Text } from "@repo/ui";
import { ImageBlock } from "../../../_components/ImageBlock";

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

  // TODO: add ability to update an image block
  // const [updatedFileId, setUpdatedFileId] = useState(block.fileId);

  const canUpdateBlock = updatedContent !== block.content;

  const updateAdventureLog = useMutation(
    api.adventureLogs.updateAdventureLogBlock
  );

  // Attempt to save updated block when block is deselected
  useEffect(() => {
    if (!selected && canUpdateBlock) {
      void updateAdventureLog({
        adventureLogId,
        blockIndex,
        content:
          updatedContent !== block.content ? updatedContent : block.content,
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
  ]);

  return (
    <>
      {selected ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-0"
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
          "relative z-10 w-full p-4 border-2 border-transparent rounded flex items-center",
          selected ? "border-primary" : "hover:border-muted"
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
          <ImageBlock fileId={block.fileId} />
        ) : (
          <EditableTextBlock
            selected={selected}
            content={updatedContent}
            setContent={setUpdatedContent}
          />
        )}
      </div>
    </>
  );
}

function EditableTextBlock({
  selected,
  content,
  setContent,
}: {
  selected: boolean;
  content: string;
  setContent: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selected && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selected]);

  function handleChange(value: string) {
    setContent(value);
    resizeTextArea();
  }

  function resizeTextArea() {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {selected ? (
        <textarea
          ref={textareaRef}
          placeholder="Start typing..."
          value={content}
          onChange={(e) => {
            handleChange(e.currentTarget.value);
          }}
          onKeyUp={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          onFocus={resizeTextArea}
          className="w-full min-h-4 text-lg bg-transparent outline-none"
          style={{ resize: "none" }}
        />
      ) : (
        <Text className="w-full text-lg whitespace-pre-wrap">
          {content === "" ? "Start typing..." : content}
        </Text>
      )}
    </div>
  );
}
