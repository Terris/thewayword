import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { Text } from "@repo/ui";
import Image from "next/image";
import Link from "next/link";

export function AdventureLogLikes({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const likes = useQuery(api.likes.findAllByAdventureLogId, {
    adventureLogId,
  });

  return (
    <div className="w-full" id="likes">
      <Text className="text-xl font-bold pb-2">Likes</Text>
      <hr className="border-b-1 border-dashed mb-4" />
      {likes?.map((like) => (
        <Link
          href={`/user/${like.userId}/adventure-logs`}
          className="inline-flex flex-row items-center gap-2 pb-4 text-sm hover:text-amber-400"
          key={like._id}
        >
          {like.user.avatarUrl ? (
            <Image
              src={like.user.avatarUrl}
              width="20"
              height="20"
              alt="User"
              className="w-5 h-5 rounded-full"
            />
          ) : null}
          <Text>{like.user.name}</Text>
        </Link>
      ))}
    </div>
  );
}
