import Link from "next/link";
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
      <div className="relative flex items-center justify-center">
        <AdventureLogCoverImage
          coverImageFileId={adventureLog.coverImageFileId}
          className="group-hover:opacity-20 transition-opacity"
        />
        <div className="opacity-0 max-w-full absolute p-4 group-hover:opacity-100 transition-opacity">
          <Text className="w-full pb-2 font-black text-xl whitespace-nowrap text-ellipsis overflow-hidden">
            {adventureLog.title}
          </Text>
        </div>
      </div>
      <div className="py-2">
        <Text className="font-soleil font-bold uppercase text-xs tracking-wider">
          {adventureLog.location?.name}
        </Text>
        <Text className="text-xs pb-2">
          {adventureLog.location?.latitude}, {adventureLog.location?.longitude}
        </Text>

        <Text className="w-full text-sm">
          By <span className="italic">{adventureLog.user.name}</span>
        </Text>
      </div>
    </Link>
  );
}
