"use client";

import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@repo/convex";
import { usePaginatedQuery } from "convex/react";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { AdventureLogFeedItem } from "../../_components/AdventureLogFeedItem";

const DEFAULT_ITEMS_PER_PAGE = 32;

export default function MeAdventureLogsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageInt = page ? parseInt(page) : 1;

  const {
    results: adventureLogs,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(
    api.adventureLogs.findAllPublicBySessionedUser,
    {
      paginationOpts: {
        numItems: DEFAULT_ITEMS_PER_PAGE,
      },
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
