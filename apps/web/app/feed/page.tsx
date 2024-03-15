"use client";

import { api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import Link from "next/link";
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
          className="group w-full border border-dashed rounded pb-8 cursor-pointer hover:border-muted transition-all"
        >
          <div className="pb-4 group-hover:p-4 group-hover:pb-8 transition-all">
            <AdventureLogCoverImage
              coverImageFileId={adventureLog.coverImageFileId}
            />
          </div>
          <div className="p-4">
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
          </div>
        </Link>
      ))}
    </div>
  );
}
