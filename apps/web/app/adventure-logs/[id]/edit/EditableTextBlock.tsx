"use client";

import { RichTextEditor } from "../../../_components/RichTextEditor";

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
    <div className="w-full max-w-[740px] mx-auto">
      <RichTextEditor
        onChange={(value) => {
          handleSetContent(value);
        }}
        initialContent={content}
        className="w-full bg-transparent outline-none font-mono leading-relaxed text-sm text-gray-700 md:text-base"
        editable={isSelected}
      />
    </div>
  );
}
