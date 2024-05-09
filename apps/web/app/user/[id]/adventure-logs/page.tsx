"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { AdventureLogFeedItem } from "../../../_components/AdventureLogFeedItem";

export default function UserAdventureLogsPage() {
  const { id } = useParams();
  const publicUser = useQuery(api.users.sessionedFindPublicUserById, {
    id: id as Id<"users">,
  });
  const adventureLogs = useQuery(api.adventureLogs.findAllPublicByUserId, {
    userId: id as Id<"users">,
  });

  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8">
      <div className="flex items-center max-w-[900px] mx-auto pb-4 md:pb-10">
        {publicUser?.avatarUrl ? (
          <Image
            src={publicUser.avatarUrl}
            width="40"
            height="40"
            alt="User"
            className="w-6 h-6 md:w-10 md:h-10 rounded-full mr-4 md:mr-6"
          />
        ) : null}
        <Text className="w-full text-2xl md:text-4xl font-bold bg-transparent outline-none focus:underline">
          {publicUser?.name}&rsquo;s Adventure Logs
        </Text>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {adventureLogs.map((adventureLog) => (
          <AdventureLogFeedItem
            key={adventureLog._id}
            adventureLog={adventureLog}
          />
        ))}
      </div>
      {!adventureLogs.length && (
        <Text className="text-center">Ohp, nothing here at the moment.</Text>
      )}
    </div>
  );
}
