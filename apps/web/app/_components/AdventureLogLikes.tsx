import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { Text } from "@repo/ui";
import Image from "next/image";

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
      <Text className="text-2xl md:text-2xl font-bold mb-4 bg-transparent outline-none focus:underline">
        Likes
      </Text>
      <hr className="border-b-1 border-dashed mb-4" />
      {likes?.map((like) => (
        <div className="flex flex-row items-center gap-2 pb-4" key={like._id}>
          {like.user.avatarUrl ? (
            <Image
              src={like.user.avatarUrl}
              width="20"
              height="20"
              alt="User"
              className="w-5 h-5 rounded-full"
            />
          ) : null}
          <Text className="text-sm">{like.user.name}</Text>
        </div>
      ))}
    </div>
  );
}
