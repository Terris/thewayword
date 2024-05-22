import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { Text } from "@repo/ui";
import Link from "next/link";

export function AdventureLogTags({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const adventureLogTags = useQuery(
    api.adventureLogTags.findAllByAdventureLogId,
    {
      adventureLogId,
    }
  );
  const isLoading = adventureLogTags === undefined;
  if (isLoading) return null;
  return (
    <Text className="font-bold text-xs uppercase tracking-widest text-neutral-400 pb-2">
      {adventureLogTags.map((tag, index) => (
        <span key={tag?.slug}>
          <Link href={`/tags/${tag?.slug}`} className="hover:underline">
            {tag?.name}
          </Link>
          {index + 1 < adventureLogTags.length ? ", " : ""}
        </span>
      ))}
    </Text>
  );
}
