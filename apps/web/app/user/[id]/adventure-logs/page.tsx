"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { CircleUserRound } from "lucide-react";
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
      <div className="w-full flex items-center justify-center pb-4">
        <CircleUserRound className="w-8 h-8 mr-6" />
        <Text className="text-3xl font-bold text-center">
          {publicUser?.name}&rsquo;s Adventure Logs
        </Text>
      </div>
      <div className="w-full py-8 grid grid-cols-4 gap-8">
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
