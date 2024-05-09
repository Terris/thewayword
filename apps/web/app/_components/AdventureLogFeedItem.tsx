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
    <Link
      href={`/adventure-logs/${adventureLog._id}`}
      className="group w-full pb-4 cursor-pointer"
    >
      <div className="relative flex items-center justify-center bg-primary rounded">
        <AdventureLogCoverImage
          adventureLogId={adventureLog._id}
          className="group-hover:opacity-50 transition-opacity"
        />
      </div>
      <div className="py-2 flex flex-col justify-start items-start">
        <Text className="w-full font-soleil font-bold uppercase text-xs tracking-wider truncate pb-1">
          {adventureLog.title}
        </Text>
        <div className="flex items-center">
          {adventureLog.user.avatarUrl ? (
            <Image
              src={adventureLog.user.avatarUrl}
              width="20"
              height="20"
              alt="User"
              className="w-5 h-5 rounded-full mr-2"
            />
          ) : null}
          <Text className="text-sm text-center leading-none italic">
            {adventureLog.user.name}
          </Text>
        </div>
      </div>
    </Link>
  );
}
