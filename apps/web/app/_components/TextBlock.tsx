import { RichTextReader } from "./RichTextReader";

export function TextBlock({ content }: { content?: string }) {
  if (content === "") return null;
  return (
    <RichTextReader
      content={content}
      className="w-full max-w-[600px] mx-auto text-lg whitespace-pre-wrap"
    />
  );
}
