"use client";

import { type Doc, api } from "@repo/convex";
import { LoadingBox, LoadingScreen, Text } from "@repo/ui";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

export default function FeedPage() {
  const adventureLogs = useQuery(api.adventureLogs.findAllPublished);
  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 grid grid-cols-3 gap-8">
      {adventureLogs.map((adventureLog) => (
        <Link
          key={adventureLog._id}
          href={`/adventure-logs/${adventureLog._id}`}
          className="w-full border rounded px-4 py-8 cursor-pointer hover:border-muted transition-all"
        >
          <LogBlockImage adventureLog={adventureLog} className="pb-8" />
          <Text className="text-center font-black text-xl pb-4">
            {adventureLog.title}
          </Text>
          <hr className="w-[30px] mx-auto mb-4" />
          <Text className="font-soleil text-center font-bold uppercase text-xs tracking-wider pb-2">
            {adventureLog.location?.name}
          </Text>
          <Text className="text-center text-xs">
            {adventureLog.location?.latitude},{" "}
            {adventureLog.location?.longitude}
          </Text>
        </Link>
      ))}
    </div>
  );
}

function LogBlockImage({
  adventureLog,
  className,
}: {
  adventureLog: Doc<"adventureLogs">;
  className?: string;
}) {
  const primaryImageBlock = adventureLog.blocks?.find(
    (block) => block.type === "image" && block.fileId
  );

  const queryArgs = primaryImageBlock?.fileId
    ? { id: primaryImageBlock.fileId }
    : "skip";

  const file = useQuery(api.files.findById, queryArgs);
  const isLoading = file === undefined;

  if (isLoading) return <LoadingBox />;
  if (!primaryImageBlock || !file) return null;
  return (
    <Image
      src={file.url}
      width={file.dimensions?.width}
      height={file.dimensions?.height}
      alt={file.fileName}
      className={cn("rounded", className)}
    />
  );
}
