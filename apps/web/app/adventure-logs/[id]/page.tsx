"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { MessageCircle, Pencil } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { LoadingScreen, Text } from "@repo/ui";
import { formatDate } from "@repo/utils";
import { AdventureLogMap } from "../../_components/AdventureLogMap";
import { AdventureLogBlocks } from "../../_components/AdventureLogBlocks";
import { AdventureLogComments } from "../../_components/AdventureLogComments";
import { AdventureLogLikeButton } from "../../_components/AdventureLogLikeButton";
import { AdventureLogTags } from "../../_components/AdventureLogTags";
import { AdventureLogLikes } from "../../_components/AdventureLogLikes";

export default function AdventureLogPage() {
  const { id } = useParams();
  const { me } = useMeContext();
  const adventureLog = useQuery(api.adventureLogs.findById, {
    id: id as Id<"adventureLogs">,
  });
  const isLoading = adventureLog === undefined;
  const meIsLogOwner = me?.id === adventureLog?.user?._id;

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="w-full h-[45vh]">
        {adventureLog.location?.longitude && adventureLog.location.latitude ? (
          <AdventureLogMap
            adventureLogId={adventureLog._id}
            longitude={adventureLog.location.longitude}
            latitude={adventureLog.location.latitude}
            zoom={13}
            markerTitle={adventureLog.location.name}
          />
        ) : null}
      </div>
      <div className="relative z-50 w-full container bg-background -mt-28">
        <div className="max-w-[980px] mx-auto py-8 md:pt-12 md:pb-20">
          <AdventureLogTags adventureLogId={id as Id<"adventureLogs">} />
          <Text className="w-full text-2xl font-meta-serif font-black tracking-tight md:text-4xl pb-4 bg-transparent">
            {adventureLog.title}
          </Text>
          <div className="flex flex-col-reverse md:flex-row md:items-center border-t border-dashed">
            <div className="border-r border-dashed pr-4 pt-1">
              <Link
                href={`/user/${adventureLog.user?._id}/adventure-logs/`}
                className="flex items-center text-neutral-400 hover:text-amber-400 transition-opacity"
              >
                {adventureLog.user?.avatarUrl ? (
                  <Image
                    src={adventureLog.user.avatarUrl}
                    width="20"
                    height="20"
                    alt="User"
                    className="w-5 h-5 rounded-full mr-2"
                  />
                ) : null}
                <Text
                  as="span"
                  className="font-bold uppercase text-xs tracking-wider"
                >
                  {adventureLog.user?.name}
                </Text>
              </Link>
            </div>
            <div className="hidden md:block md:border-r border-dashed md:px-4 pt-1">
              <Text className="font-bold uppercase text-xs text-neutral-400 tracking-wider">
                {adventureLog.adventureStartDate
                  ? formatDate(adventureLog.adventureStartDate)
                  : null}
                {adventureLog.adventureEndDate
                  ? `-${formatDate(adventureLog.adventureEndDate)}`
                  : null}
              </Text>
            </div>
            <div className="px-0 md:px-4 pt-1">
              <Text className="font-bold uppercase text-xs text-neutral-400 tracking-wider">
                <span className="md:hidden">
                  {adventureLog.adventureStartDate
                    ? formatDate(adventureLog.adventureStartDate)
                    : null}
                  {adventureLog.adventureEndDate
                    ? `-${formatDate(adventureLog.adventureEndDate)}`
                    : null}{" "}
                  &bull;{" "}
                </span>
                {adventureLog.location?.name}
              </Text>
            </div>
          </div>
        </div>
        <div className="max-w-[740px] mx-auto">
          <AdventureLogBlocks adventureLogId={id as Id<"adventureLogs">} />
        </div>

        <div className="p-8 flex justify-center items-center lg:z-50 lg:w-auto lg:flex-col lg:fixed lg:top-[50vh] lg:h-[1px] lg:right-1  ">
          <div className="flex flex-row lg:flex-col gap-4">
            {meIsLogOwner ? (
              <Link
                href={`/adventure-logs/${id as string}/edit`}
                className="bg-background border rounded-full p-3 hover:bg-neutral-200 lg:shadow-md"
              >
                <Pencil className="w-4 h-4 " />
              </Link>
            ) : null}
            <AdventureLogLikeButton
              adventureLogId={id as Id<"adventureLogs">}
            />
            <Link
              href="#comments"
              className="bg-background border rounded-full p-3 hover:bg-neutral-200 lg:shadow-md"
            >
              <MessageCircle className="w-4 h-4 " />
            </Link>
          </div>
        </div>

        <div className="pt-20 flex flex-col items-start justify-start md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <AdventureLogLikes adventureLogId={id as Id<"adventureLogs">} />
          </div>
          <div className="w-full md:w-2/3">
            <AdventureLogComments adventureLogId={id as Id<"adventureLogs">} />
          </div>
        </div>
      </div>
    </>
  );
}
