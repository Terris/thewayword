import { type Id } from "@repo/convex";
import { useState } from "react";
import { cn } from "@repo/utils";
import { ImageBlock } from "../../../_components/ImageBlock";
import { TextBlock } from "../../../_components/TextBlock";

interface Block {
  type: "text" | "image";
  order: number;
  content: string;
  fileId?: Id<"files">;
}

interface EditableBlockProps {
  block: Block;
}

export function EditableBlock({ block }: EditableBlockProps) {
  const [selected, setSelected] = useState(false);

  function handleSelect() {
    setSelected((s) => !s);
  }

  return (
    <button
      type="button"
      style={{ margin: "-1rem" }}
      className={cn(
        "p-4 border-2 border-transparent rounded",
        selected ? "border-primary" : "hover:border-muted"
      )}
      onClick={() => {
        handleSelect();
      }}
    >
      {block.type === "image" && block.fileId ? (
        <ImageBlock fileId={block.fileId} />
      ) : (
        <TextBlock content={block.content} />
      )}
    </button>
  );
}
