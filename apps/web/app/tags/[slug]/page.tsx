"use client";

import { api } from "@repo/convex";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { usePaginatedQuery, useQuery } from "convex/react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import { AdventureLogFeedItem } from "../../_components/AdventureLogFeedItem";

const DEFAULT_ITEMS_PER_PAGE = 32;

export default function TagPage() {
  const router = useRouter();
  const { slug } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const pageInt = page ? parseInt(page) : 1;

  const tag = useQuery(api.tags.findBySlug, { slug: slug as string });
  const tagIsLoading = tag === undefined;

  const {
    results: adventureLogs,
    status: paginationStatus,
    loadMore,
  } = usePaginatedQuery(
    api.adventureLogs.findAllPublicByTagSlug,
    {
      tagSlug: slug as string,
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

  if (firstPageIsLoading || tagIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8">
      <Text className="w-full pb-4 text-2xl capitalize md:text-4xl font-bold bg-transparent outline-none focus:underline">
        <span className="text-neutral-400">#</span>
        {tag?.name}
      </Text>

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
