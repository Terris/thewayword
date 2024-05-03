import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { Text } from "@repo/ui";

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
    <Text className="font-soleil text-xs uppercase tracking-widest pb-2">
      {adventureLogTags.map(
        (tag, index) =>
          `${tag?.name}${index + 1 < adventureLogTags.length ? ", " : ""}`
      )}
    </Text>
  );
}
