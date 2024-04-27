"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingScreen } from "@repo/ui";
import { AdventureLogFeedItem } from "../_components/AdventureLogFeedItem";

export default function FeedPage() {
  const adventureLogs = useQuery(api.adventureLogs.findAllPublished);
  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {adventureLogs.map((adventureLog) => (
        <AdventureLogFeedItem
          key={adventureLog._id}
          adventureLog={adventureLog}
        />
      ))}
    </div>
  );
}
