"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Text } from "@repo/ui";
import { formatDateTime } from "@repo/utils";
import { AdventureLogCommentForm } from "./AdventureLogCommentForm";

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
    <div className="max-w-[900px] mx-auto p-4 md:p-10">
      <Text className="text-2xl md:text-2xl font-bold mb-4 bg-transparent outline-none focus:underline">
        Comments
      </Text>
      <hr className="border-b-1 border-dashed mb-4" />
      <AdventureLogCommentForm adventureLogId={adventureLogId} />
      <div className="pt-4">
        {comments.map((comment) => (
          <>
            <hr className="border-b-1 border-dashed" />
            <div
              key={comment._id}
              className="py-6 flex flex-row items-start gap-4"
            >
              {comment.user.avatarUrl ? (
                <Image
                  src={comment.user.avatarUrl}
                  width="20"
                  height="20"
                  alt="User"
                  className="w-5 h-5 rounded-full mt-1"
                />
              ) : null}
              <div>
                <Text className="text-sm italic mb-2">
                  {comment.user.name} <br />
                  {formatDateTime(comment._creationTime)}
                </Text>
                <Text>{comment.message}</Text>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
