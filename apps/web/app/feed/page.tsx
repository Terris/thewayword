"use client";

import { type Id, api } from "@repo/convex";
import { LoadingBox, LoadingScreen, Text } from "@repo/ui";
import { AspectRatio } from "@repo/ui/AspectRatio";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

export default function FeedPage() {
  const adventureLogs = useQuery(api.adventureLogs.findAllPublished);
  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 grid grid-cols-4 gap-8">
      {adventureLogs.map((adventureLog) => (
        <Link
          key={adventureLog._id}
          href={`/adventure-logs/${adventureLog._id}`}
          className="w-full border rounded p-4 pb-8 cursor-pointer hover:border-muted transition-all"
        >
          <LogShowcaseImage
            showcaseFileId={adventureLog.showcaseFileId}
            className="pb-8"
          />
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

function LogShowcaseImage({
  showcaseFileId,
  className,
}: {
  showcaseFileId?: Id<"files">;
  className?: string;
}) {
  const queryArgs = showcaseFileId ? { id: showcaseFileId } : "skip";

  const file = useQuery(api.files.findById, queryArgs);
  const isLoading = file === undefined;

  if (!showcaseFileId || (!isLoading && file === null)) return null;
  if (isLoading) return <LoadingBox />;
  return (
    <AspectRatio ratio={4 / 3} className="rounded">
      <Image
        src={file.url}
        alt={file.fileName}
        objectFit="cover"
        layout="fill"
        className={cn("rounded object-fill", className)}
      />
    </AspectRatio>
  );
}
