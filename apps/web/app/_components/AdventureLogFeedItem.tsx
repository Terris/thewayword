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
      className="group w-full pb-4 text-background bg-foreground hover:bg-black rounded cursor-pointer transition-all"
    >
      <div className="p-2">
        <AdventureLogCoverImage
          coverImageFileId={adventureLog.coverImageFileId}
        />
      </div>
      <div className="py-4">
        <Text className="w-full pb-4 text-center font-black text-xl whitespace-nowrap  text-ellipsis overflow-hidden">
          {adventureLog.title}
        </Text>
        <Text className="font-soleil text-center font-bold uppercase text-xs tracking-wider pb-2">
          {adventureLog.location?.name}
        </Text>
        <Text className="text-center text-xs pb-3">
          {adventureLog.location?.latitude}, {adventureLog.location?.longitude}
        </Text>
        <hr className="w-[30px] mx-auto mb-4" />
        <Text className="w-full text-center text-sm font-bold">
          {adventureLog.user.name}
        </Text>
      </div>
    </Link>
  );
}
