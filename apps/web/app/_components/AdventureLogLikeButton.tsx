import { useMutation, useQuery } from "convex/react";
import { Heart } from "lucide-react";
import { api, type Id } from "@repo/convex";
import { CountBadge } from "@repo/ui";
import { cn } from "@repo/utils";

export function AdventureLogLikeButton({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const userLikesAdventureLog = useQuery(
    api.likes.findOneBySessionedUserAndAdventureLogId,
    {
      adventureLogId,
    }
  );
  const toggleLikeAdventureLog = useMutation(
    api.likes.toggleLikeBySessionedUserAndAdventureLogId
  );
  const likes = useQuery(api.likes.findAllByAdventureLogId, {
    adventureLogId,
  });

  const likeCount = likes?.length;

  return (
    <button
      type="button"
      className={cn(
        "relative bg-background border rounded-full p-3 hover:bg-neutral-200 lg:shadow-md",
        userLikesAdventureLog && "text-red-500"
      )}
      onClick={() => {
        void toggleLikeAdventureLog({
          adventureLogId,
        });
      }}
    >
      <Heart
        className="w-4 h-4"
        fill={userLikesAdventureLog ? "red" : "transparent"}
      />
      {likeCount ? (
        <CountBadge count={likeCount} className="absolute -top-2 -right-2" />
      ) : null}
    </button>
  );
}
