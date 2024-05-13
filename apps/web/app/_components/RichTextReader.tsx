"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

const extensions = [StarterKit];

const emptyJSON = '""';

interface RichTextReaderProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string;
}

export function RichTextReader({
  content = emptyJSON,
  className,
}: RichTextReaderProps) {
  const editor = useEditor({
    editable: false,
    extensions,
    // eslint-disable-next-line -- @typescript-eslint/no-unsafe-assignment
    content: JSON.parse(content === "" ? emptyJSON : content),
  });

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}
