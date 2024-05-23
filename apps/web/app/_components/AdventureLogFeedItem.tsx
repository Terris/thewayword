import Link from "next/link";
import Image from "next/image";
import { type Doc } from "@repo/convex";
import { Text } from "@repo/ui";
import { AdventureLogCoverImage } from "./AdventureLogCoverImage";

interface AdventureLogFeedItemProps {
  adventureLog: Doc<"adventureLogs"> & { user: Partial<Doc<"users">> };
}

export function AdventureLogFeedItem({
  adventureLog,
}: AdventureLogFeedItemProps) {
  return (
    <div className="w-full">
      <Link
        href={`/adventure-logs/${adventureLog._id}`}
        className="group w-full pb-4 cursor-pointer"
      >
        <div
          className="relative w-full rounded mb-2"
          style={{ aspectRatio: "4 / 3" }}
        >
          <AdventureLogCoverImage
            adventureLogId={adventureLog._id}
            className="group-hover:opacity-50 transition-opacity"
          />
        </div>
        <Text className="w-full font-bold uppercase text-xs tracking-wider truncate pb-1">
          {adventureLog.title}
        </Text>
      </Link>
      <Link
        href={`/user/${adventureLog.userId}/adventure-logs`}
        className="group flex items-center cursor-pointer"
      >
        {adventureLog.user.avatarUrl ? (
          <Image
            src={adventureLog.user.avatarUrl}
            width="20"
            height="20"
            alt="User"
            className="w-5 h-5 rounded-full mr-2"
          />
        ) : null}
        <Text className="text-sm text-center group-hover:underline">
          {adventureLog.user.name}
        </Text>
      </Link>
    </div>
  );
}
