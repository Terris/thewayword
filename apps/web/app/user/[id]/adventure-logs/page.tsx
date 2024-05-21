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
import { cn, formatDate } from "@repo/utils";
import { useMeContext } from "@repo/auth/context";
import { AdventureLogFeedItem } from "../../../_components/AdventureLogFeedItem";
import { ToggleFolowButton } from "./ToggleFollowButton";
import { LayoutGrid, MapPinned } from "lucide-react";
import { AdventureLogFeedMap } from "../../../_components/AdventureLogFeedMap";

const DEFAULT_ITEMS_PER_PAGE = 32;

export default function UserAdventureLogsPage() {
  const router = useRouter();
  const { me } = useMeContext();
  const { id } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const layout = searchParams.get("layout");
  const pageInt = page ? parseInt(page) : 1;

  const publicUser = useQuery(api.users.sessionedFindPublicUserById, {
    id: id as Id<"users">,
  });

  const publicUserIsLoading = publicUser === undefined;

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

  if (firstPageIsLoading || publicUserIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8">
      <div className="flex flex-row items-start justify-start pb-4 md:pb-8">
        <div>
          {publicUser.avatarUrl ? (
            <Image
              src={publicUser.avatarUrl}
              width="40"
              height="40"
              alt="User"
              className="w-6 h-6 mt-2 md:mt-0 md:w-16 md:h-16 rounded-full mr-4 md:mr-6"
            />
          ) : null}
        </div>
        <div>
          <Text className="w-full text-2xl md:text-4xl font-bold bg-transparent outline-none focus:underline">
            {publicUser.name}
          </Text>
          <Text className="font-soleil text-sm pb-4">
            Member since {formatDate(publicUser.createdAt)}
          </Text>
          {me?.id !== id ? (
            <ToggleFolowButton followeeUserId={id as Id<"users">} />
          ) : null}
        </div>
      </div>
      <Text className="font-soleil">
        {publicUser.name}&rsquo;s Adventure Logs
      </Text>
      <hr className="border-b-1 border-dashed mb-4" />
      <div className="pb-4 flex gap-2">
        <Button
          variant="outline"
          className={cn((!layout || layout === "grid") && "bg-accent")}
          onClick={() => {
            router.push(`${pathname}?${createQueryString("layout", "grid")}`);
          }}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className={cn(layout === "map" && "bg-accent")}
          onClick={() => {
            router.push(`${pathname}?${createQueryString("layout", "map")}`);
          }}
        >
          <MapPinned className="h-4 w-4" />
        </Button>
      </div>
      {!layout || layout === "grid" ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
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
        <Text className="text-center py-8">
          Ohp, nothing here at the moment.
        </Text>
      )}
    </div>
  );
}
