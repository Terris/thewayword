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
    <Text className="font-soleil text-xs uppercase tracking-widest pb-2 text-zinc-400">
      {adventureLogTags.map((tag, index) => (
        <>
          <Link
            href={`/tags/${tag?.slug}`}
            key={tag?.slug}
            className="hover:underline"
          >
            {tag?.name}
          </Link>
          {index + 1 < adventureLogTags.length ? ", " : ""}
        </>
      ))}
    </Text>
  );
}
