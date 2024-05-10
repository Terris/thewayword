"use client";

import { useCallback } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Image from "next/image";
import { usePaginatedQuery, useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { AdventureLogFeedItem } from "../../../_components/AdventureLogFeedItem";

const DEFAULT_ITEMS_PER_PAGE = 32;

export default function UserAdventureLogsPage() {
  const router = useRouter();
  const { id } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageInt = page ? parseInt(page) : 1;

  const publicUser = useQuery(api.users.sessionedFindPublicUserById, {
    id: id as Id<"users">,
  });

  const {
    results: adventureLogs,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(
    api.adventureLogs.findAllPublicByUserId,
    {
      userId: id as Id<"users">,
    },
    {
      initialNumItems: page
        ? pageInt * DEFAULT_ITEMS_PER_PAGE
        : DEFAULT_ITEMS_PER_PAGE,
    }
  );

  const firstPageIsLoading = paginationStatus === "LoadingFirstPage";
  const newPageIsLoading = paginationStatus === "LoadingMore";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function handleShowMore() {
    loadMore(DEFAULT_ITEMS_PER_PAGE);
    router.push(
      `${pathname}?${createQueryString("page", (pageInt + 1).toString())}`,
      {
        scroll: false,
      }
    );
  }

  if (firstPageIsLoading) return <LoadingScreen />;

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
      {adventureLogs.length ? (
        <div className="w-full max-w-[300px] mx-auto">
          {paginationStatus === "CanLoadMore" ? (
            <Button
              variant="outline"
              onClick={() => {
                handleShowMore();
              }}
              disabled={newPageIsLoading}
              className="w-full"
            >
              Load more
            </Button>
          ) : (
            <Text className="text-center py-8">
              You&rsquo;ve reached the end.
            </Text>
          )}
        </div>
      ) : (
        <Text className="text-center py-8">
          Ohp, nothing here at the moment.
        </Text>
      )}
    </div>
  );
}
