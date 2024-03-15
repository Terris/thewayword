import { useEffect, useRef } from "react";
import { Text } from "@repo/ui";

export function EditableTextBlock({
  selected,
  content,
  setContent,
}: {
  selected: boolean;
  content?: string;
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
          className="w-full h-1 text-lg bg-transparent outline-none"
          style={{ resize: "none" }}
        />
      ) : (
        <Text className="w-full min-h-4 text-lg whitespace-pre-wrap">
          {content === "" ? "Start typing..." : content}
        </Text>
      )}
    </div>
  );
}
