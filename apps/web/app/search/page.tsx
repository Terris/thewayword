"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const searchResults = useQuery(
    api.tags.search,
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
    <div className="w-full p-8">
      {searchResults?.map((result) => (
        <Text key={result._id} className="capitalize">
          {result.name}
        </Text>
      ))}
    </div>
  );
}
