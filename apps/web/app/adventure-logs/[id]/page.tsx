"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { MessageCircle, Pencil } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { LoadingScreen, Text } from "@repo/ui";
import { formatDate } from "@repo/utils";
import { ImageBlock } from "../../_components/ImageBlock";
import { AdventureLogMap } from "../../_components/AdventureLogMap";
import { AdventureLogBlocks } from "../../_components/AdventureLogBlocks";
import { AdventureLogComments } from "../../_components/AdventureLogComments";
import { AdventureLogLikeButton } from "../../_components/AdventureLogLikeButton";
import { AdventureLogTags } from "../../_components/AdventureLogTags";

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
        <AdventureLogMap
          defaultLongitude={-105.628997}
          defaultLatitude={40.342441}
          initialLongitude={adventureLog.location?.longitude}
          initialLatitude={adventureLog.location?.longitude}
          featureLongitude={adventureLog.location?.longitude}
          featureLatitude={adventureLog.location?.latitude}
          moveable={false}
        />
      </div>
      <div className="relative z-50 w-full container bg-background -mt-28">
        <div className="max-w-[900px] mx-auto p-4 md:p-10 md:pt-12">
          <AdventureLogTags adventureLogId={id as Id<"adventureLogs">} />
          <Text className="w-full text-2xl md:text-4xl font-bold mb-4 bg-transparent outline-none focus:underline">
            {adventureLog.title}
          </Text>
          <hr className="border-b-1 border-dashed mb-4" />
          <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-1">
            {adventureLog.location?.name}{" "}
            {adventureLog.adventureStartDate
              ? `- ${formatDate(adventureLog.adventureStartDate)}`
              : null}
          </Text>
          <Text className="w-full text-sm italic text-muted-foreground">
            {adventureLog.user?.name}
          </Text>
        </div>
        {adventureLog.coverImageFileId ? (
          <ImageBlock fileId={adventureLog.coverImageFileId} className="mb-8" />
        ) : null}
        <AdventureLogBlocks adventureLogId={id as Id<"adventureLogs">} />
        <div id="comments" />
        <AdventureLogComments adventureLogId={id as Id<"adventureLogs">} />
      </div>
      <div className="p-8 flex justify-center items-center w-full lg:z-50 lg:w-auto lg:flex-col lg:fixed lg:top-[50vh] lg:h-[1px] lg:right-0  ">
        <div className="flex flex-row lg:flex-col gap-4">
          {meIsLogOwner ? (
            <Link
              href={`/adventure-logs/${id as string}/edit`}
              className="bg-background border rounded-full p-3 hover:bg-muted"
            >
              <Pencil className="w-4 h-4 " />
            </Link>
          ) : null}
          <AdventureLogLikeButton adventureLogId={id as Id<"adventureLogs">} />
          <Link
            href="#comments"
            className="bg-background border rounded-full p-3 hover:bg-muted"
          >
            <MessageCircle className="w-4 h-4 " />
          </Link>
        </div>
      </div>
    </>
  );
}
