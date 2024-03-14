import { Text } from "@repo/ui";

export function TextBlock({ content }: { content: string }) {
  return (
    <Text className="w-full max-w-[600px] mx-auto text-lg whitespace-pre-wrap">
      {content}
    </Text>
  );
}
