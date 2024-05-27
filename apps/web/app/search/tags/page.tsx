"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SearchTagsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const tagSearchResults = useQuery(
    api.tags.search,
    !query
      ? "skip"
      : {
          queryTerm: query,
        }
  );
  const isLoading = Boolean(query) && tagSearchResults === undefined;

  if (isLoading) return <LoadingBox />;

  if (!tagSearchResults || tagSearchResults.length === 0) {
    return (
      <Text className="text-center text-neutral-400">
        Sorry, nothing found.
      </Text>
    );
  }

  return (
    <div className="w-full p-8">
      {tagSearchResults.map((result) => (
        <Text key={result._id} className="capitalize text-4xl text-center pb-4">
          <Link href={`/tags/${result.slug}`} className="hover:text-amber-400">
            <span className="text-neutral-400">#</span>
            {result.name}
          </Link>
        </Text>
      ))}
    </div>
  );
}
