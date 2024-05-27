"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingBox, Text } from "@repo/ui";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@repo/utils";
import { ToggleFolowButton } from "../../user/[id]/adventure-logs/ToggleFollowButton";
import { useMeContext } from "@repo/auth/context";

export default function SearchTagsPage() {
  const { me } = useMeContext();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const userSearchResults = useQuery(
    api.users.search,
    !query
      ? "skip"
      : {
          queryTerm: query,
        }
  );

  const isLoading = Boolean(query) && userSearchResults === undefined;

  if (isLoading) return <LoadingBox />;

  if (!userSearchResults || userSearchResults.length === 0) {
    return (
      <Text className="text-center text-neutral-400">
        Sorry, nothing found.
      </Text>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="w-full pb-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {userSearchResults?.map((result) => (
          <div key={result._id} className="border rounded p-4">
            <div className="flex flex-row items-start justify-start">
              <div>
                {result.avatarUrl ? (
                  <Image
                    src={result.avatarUrl}
                    width="20"
                    height="20"
                    alt="User"
                    className="w-6 h-6 mt-2 md:w-8 md:h-8 rounded-full mr-4"
                  />
                ) : null}
              </div>
              <div>
                <Text className="w-full text-xl font-bold tracking-tight outline-none focus:underline">
                  {result.name}
                </Text>
                <Text className="text-sm text-neutral-400 pb-4">
                  Member since {formatDate(result.createdAt)}
                </Text>
                {me?.id !== result._id ? (
                  <ToggleFolowButton followeeUserId={result._id} />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
