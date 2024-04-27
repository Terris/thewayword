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
      <div className="relative flex items-center justify-center bg-primary rounded">
        <AdventureLogCoverImage
          coverImageFileId={adventureLog.coverImageFileId}
          className="group-hover:opacity-10 transition-opacity"
        />
        <div className="opacity-0 max-w-full absolute p-16 group-hover:opacity-100 transition-opacity">
          <Text className="w-full font-black text-xl text-center text-background overflow-hidden">
            {adventureLog.title}
          </Text>
        </div>
      </div>
      <div className="py-2 flex flex-row justify-between items-start">
        <div className="w-2/3">
          <Text className="font-soleil font-bold uppercase text-xs tracking-wider">
            {adventureLog.location?.name}
          </Text>
          <Text className="text-xs pb-2">
            {adventureLog.location?.latitude},{" "}
            {adventureLog.location?.longitude}
          </Text>
        </div>
        <Text className="text-sm text-right w-1/3">
          By <span className="italic">{adventureLog.user.name}</span>
        </Text>
      </div>
    </Link>
  );
}
