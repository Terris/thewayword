"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Button, Text } from "@repo/ui";
import { AdventureLogCommentForm } from "./AdventureLogCommentForm";
import { EditableComment } from "./EditableComment";

export function AdventureLogComments({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const [commentFormIsOpen, setCommentFormIsOpen] = useState(false);
  const comments = useQuery(api.comments.findAllByAdventureLogId, {
    adventureLogId,
  });
  const isLoading = comments === undefined;

  if (isLoading) return null;

  return (
    <div className="w-full" id="comments">
      <Text className="text-xl font-bold pb-2">Comments</Text>
      <hr className="border-b-1 border-dashed" />
      <div className="pb-4">
        {comments.map((comment) => (
          <div key={comment._id} id={`comments-${comment._id}`}>
            <EditableComment comment={comment} />
            <hr className="border-b-1 border-dashed" />
          </div>
        ))}
      </div>
      {commentFormIsOpen ? (
        <AdventureLogCommentForm
          adventureLogId={adventureLogId}
          onSuccess={() => {
            setCommentFormIsOpen(false);
          }}
        />
      ) : (
        <Button
          onClick={() => {
            setCommentFormIsOpen(true);
          }}
          variant="outline"
          size="sm"
        >
          Add a comment
        </Button>
      )}
    </div>
  );
}
