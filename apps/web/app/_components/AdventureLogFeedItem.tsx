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
          className="relative w-full rounded mb-2 overflow-hidden"
          style={{ aspectRatio: "4 / 3" }}
        >
          <AdventureLogCoverImage adventureLogId={adventureLog._id} />
          <div className="opacity-0 group-hover:opacity-100 absolute top-0 left-0 right-0 h-1 bg-amber-400 transition-opacity" />
        </div>
        <Text className="w-full font-bold uppercase text-xs tracking-wider truncate pb-1 group-hover:text-amber-400">
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
        <Text className="text-sm text-center group-hover:text-amber-400">
          {adventureLog.user.name}
        </Text>
      </Link>
    </div>
  );
}
