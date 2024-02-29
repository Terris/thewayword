"use client";

import { api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function FeedPage() {
  const adventureLogs = useQuery(api.adventureLogs.findAllPublished);
  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 flex flex-row gap-8">
      {adventureLogs.map((adventureLog) => (
        <Link
          key={adventureLog._id}
          href={`/adventure-logs/${adventureLog._id}`}
          className="w-1/3 border rounded px-4 py-8 cursor-pointer hover:border-foreground transition-all"
        >
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
