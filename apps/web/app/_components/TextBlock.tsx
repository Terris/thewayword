import { RichTextReader } from "./RichTextReader";

export function TextBlock({ content }: { content?: string }) {
  if (content === "") return null;
  return (
    <RichTextReader
      content={content}
      className="w-full max-w-[660px] mx-auto whitespace-pre-wrap font-mono leading-relaxed"
    />
  );
}
