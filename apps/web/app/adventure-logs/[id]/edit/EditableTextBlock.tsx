"use client";

import { RichTextEditor } from "../../../_components/RichTextEditor";
import { RichTextReader } from "../../../_components/RichTextReader";

export function EditableTextBlock({
  isSelected,
  content,
  setContent,
}: {
  isSelected: boolean;
  content?: string;
  setContent: (value: string) => void;
}) {
  function handleSetContent(value: string) {
    if (content === value) return;
    if (value === '{"type":"doc","content":[{"type":"paragraph"}]}') {
      setContent(
        '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Start typing..."}]}]}'
      );
      return;
    }
    setContent(value);
  }

  return (
    <div className="w-full max-w-[600px] mx-auto">
      {isSelected ? (
        <RichTextEditor
          onChange={(value) => {
            handleSetContent(value);
          }}
          initialContent={content}
          className="w-full bg-transparent outline-none font-mono leading-relaxed"
        />
      ) : (
        <RichTextReader
          content={content}
          className="w-full min-h-4 whitespace-pre-wrap font-mono leading-relaxed"
        />
      )}
    </div>
  );
}
