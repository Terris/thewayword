"use client";

import { useEffect } from "react";
import {
  type Editor,
  useEditor,
  EditorContent,
  BubbleMenu,
} from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@repo/ui";
import { cn } from "@repo/utils";

const emptyJSON = '""';

interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  className?: string;
}

export function RichTextEditor({
  initialContent = emptyJSON,
  onChange,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing…",
      }),
    ],
    // eslint-disable-next-line -- @typescript-eslint/no-unsafe-assignment
    content: JSON.parse(initialContent === "" ? emptyJSON : initialContent),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(JSON.stringify(json));
    },
  });

  if (!editor) return null;
  return (
    <div className={className}>
      <InlineMenu editor={editor} />
      {/* <BlockMenu editor={editor} /> */}
      <EditorContent editor={editor} placeholder="Type something..." />
    </div>
  );
}

function InlineMenu({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, maxWidth: "100%", placement: "top-start" }}
      className="w-full bg-secondary flex flex-wrap gap-1 items-center p-2 shadow-sm rounded"
    >
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        helpText="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        helpText="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        helpText="Strike"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      {/* <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        helpText="Paragraph"
      >
        <Pilcrow className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        helpText="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        helpText="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        helpText="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        helpText="Bullet list"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        helpText="Numbered list"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        helpText="Code block"
      >
        <SquareCode className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        helpText="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton> */}
    </BubbleMenu>
  );
}

// function BlockMenu({ editor }: { editor: Editor | null }) {
//   if (!editor) return null;

//   return (
//     <FloatingMenu
//       editor={editor}
//       tippyOptions={{ duration: 100, maxWidth: "100%", placement: "top-start" }}
//       className="w-full bg-secondary flex flex-wrap gap-1 items-center p-2 shadow-sm"
//     >
//       <ToolbarButton
//         onClick={() => editor.chain().focus().setParagraph().run()}
//         isActive={editor.isActive("paragraph")}
//         helpText="Paragraph"
//       >
//         <Pilcrow className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
//         isActive={editor.isActive("heading", { level: 1 })}
//         helpText="Heading 1"
//       >
//         <Heading1 className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
//         isActive={editor.isActive("heading", { level: 2 })}
//         helpText="Heading 2"
//       >
//         <Heading2 className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
//         isActive={editor.isActive("heading", { level: 3 })}
//         helpText="Heading 3"
//       >
//         <Heading3 className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleBulletList().run()}
//         isActive={editor.isActive("bulletList")}
//         helpText="Bullet list"
//       >
//         <List className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleOrderedList().run()}
//         isActive={editor.isActive("orderedList")}
//         helpText="Numbered list"
//       >
//         <ListOrdered className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleCodeBlock().run()}
//         isActive={editor.isActive("codeBlock")}
//         helpText="Code block"
//       >
//         <SquareCode className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().toggleBlockquote().run()}
//         isActive={editor.isActive("blockquote")}
//         helpText="Blockquote"
//       >
//         <Quote className="w-4 h-4" />
//       </ToolbarButton>

//       <ToolbarButton
//         onClick={() => editor.chain().focus().setHorizontalRule().run()}
//         helpText="Divider"
//       >
//         <Minus className="w-4 h-4" />
//       </ToolbarButton>
//     </FloatingMenu>
//   );
// }

interface ToolbarButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  helpText?: string;
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  isActive,
  helpText,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            onClick={onClick}
            size="sm"
            variant="ghost"
            disabled={disabled}
            className={cn(isActive ? "bg-neutral-300" : null)}
            style={{ pointerEvents: disabled ? "none" : "auto" }}
          >
            {children}
          </Button>
        </span>
      </TooltipTrigger>
      {helpText ? <TooltipContent>{helpText}</TooltipContent> : null}
    </Tooltip>
  );
}
