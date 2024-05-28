"use client";

import { RichTextEditor } from "../../../_components/RichTextEditor";
import { useBlockEditorContext } from "./BlockEditorContext";

export function EditableTextBlock({
  isSelected,
  content,
}: {
  isSelected: boolean;
  content?: string;
}) {
  const { handleUpdateBlock } = useBlockEditorContext();

  function handleUpdateBlockContent(updatedContent: string) {
    if (updatedContent === content) return;
    handleUpdateBlock({
      content: updatedContent,
    });
  }

  return (
    <div className="w-full max-w-[740px] mx-auto">
      <RichTextEditor
        onChange={(value) => {
          handleUpdateBlockContent(value);
        }}
        initialContent={content}
        className="w-full bg-transparent outline-none font-mono leading-relaxed text-sm text-gray-700 md:text-base"
        editable={isSelected}
      />
    </div>
  );
}
