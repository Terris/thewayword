"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { AdventureLogCoverImage } from "../_components/AdventureLogCoverImage";

export default function FeedPage() {
  const adventureLogs = useQuery(api.adventureLogs.findAllPublished);
  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {adventureLogs.map((adventureLog) => (
        <Link
          key={adventureLog._id}
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
              {adventureLog.location?.latitude},{" "}
              {adventureLog.location?.longitude}
            </Text>
            <hr className="w-[30px] mx-auto mb-4" />
            <Text className="w-full text-center text-sm font-bold">
              {adventureLog.user.name}
            </Text>
          </div>
        </Link>
      ))}
    </div>
  );
}
