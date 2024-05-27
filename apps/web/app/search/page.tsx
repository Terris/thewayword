"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { useSearchParams } from "next/navigation";
import { AdventureLogFeedItem } from "../_components/AdventureLogFeedItem";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const searchResults = useQuery(
    api.adventureLogs.search,
    !query
      ? "skip"
      : {
          queryTerm: query,
        }
  );

  const isLoading = Boolean(query) && searchResults === undefined;

  if (isLoading) return <LoadingBox />;

  if (!searchResults || searchResults.length === 0) {
    return (
      <Text className="text-center text-neutral-400">
        Sorry, nothing found.
      </Text>
    );
  }
  return (
    <div className="w-full pb-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
      {searchResults.map((adventureLog) => (
        <AdventureLogFeedItem
          key={adventureLog._id}
          adventureLog={adventureLog}
        />
      ))}
    </div>
  );
}
