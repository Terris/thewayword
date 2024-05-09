"use client";

import { api } from "@repo/convex";
import { useQuery } from "convex/react";
import { LoadingScreen, Text } from "@repo/ui";
import { AdventureLogFeedItem } from "../../../_components/AdventureLogFeedItem";

export default function MeAdventureLogsPage() {
  const adventureLogs = useQuery(
    api.adventureLogs.findAllPrivateBySessionedUser
  );

  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="w-full py-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
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
    </>
  );
}
