"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { usePaginatedQuery } from "convex/react";
import { api } from "@repo/convex";
import { Button, LoadingBox, Text } from "@repo/ui";
import { AdventureLogFeedItem } from "../_components/AdventureLogFeedItem";
import { AdventureLogFeedMap } from "../_components/AdventureLogFeedMap";

const DEFAULT_ITEMS_PER_PAGE = 32;

export default function FeedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const layout = searchParams.get("layout");
  const pageInt = page ? parseInt(page) : 1;

  const {
    results: adventureLogs,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(
    api.adventureLogs.findAllFollowingPublicBySessionedUserId,
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

  if (firstPageIsLoading) return <LoadingBox />;

  return (
    <>
      {!layout || layout === "grid" ? (
        <div className="w-full pb-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {adventureLogs.map((adventureLog) => (
            <AdventureLogFeedItem
              key={adventureLog._id}
              adventureLog={adventureLog}
            />
          ))}
        </div>
      ) : null}

      {layout === "map" ? (
        <div className="w-full h-[70vh] rounded">
          <AdventureLogFeedMap adventureLogs={adventureLogs} />
        </div>
      ) : null}

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
          ) : null}
        </div>
      ) : (
        <>
          <Text className="text-center pt-8">
            Ohp, there are currently no posts by the people you follow.{" "}
          </Text>
          <Text className="text-center pb-8">
            <Link
              href="/feed/all"
              className="underline hover:opacity-80 transition-opacity"
            >
              Explore all posts
            </Link>{" "}
            to find people to follow.
          </Text>
        </>
      )}
    </>
  );
}
