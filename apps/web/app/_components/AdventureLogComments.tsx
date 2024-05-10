"use client";

import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Text } from "@repo/ui";
import { AdventureLogCommentForm } from "./AdventureLogCommentForm";
import { EditableComment } from "./EditableComment";

export function AdventureLogComments({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const comments = useQuery(api.comments.findAllByAdventureLogId, {
    adventureLogId,
  });
  const isLoading = comments === undefined;

  if (isLoading) return null;

  return (
    <div className="w-full" id="comments">
      <Text className="text-2xl md:text-2xl font-bold mb-4 bg-transparent outline-none focus:underline">
        Comments
      </Text>
      <hr className="border-b-1 border-dashed" />
      <div className="pb-4">
        {comments.map((comment) => (
          <div key={comment._id}>
            <EditableComment comment={comment} />
            <hr className="border-b-1 border-dashed" />
          </div>
        ))}
      </div>
      <AdventureLogCommentForm adventureLogId={adventureLogId} />
    </div>
  );
}
