"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Heart, MessageCircle, Pencil } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { cn } from "@repo/utils";
import { ImageBlock } from "../../_components/ImageBlock";
import { AdventureLogMap } from "../../_components/AdventureLogMap";
import { AdventureLogBlocks } from "./AdventureLogBlocks";

export default function AdventureLogPage() {
  const { id } = useParams();
  const adventureLog = useQuery(api.adventureLogs.findById, {
    id: id as Id<"adventureLogs">,
  });
  const isLoading = adventureLog === undefined;

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
        />
      </div>

      <div className="relative z-50 w-full container bg-background -mt-28 pt-8 px-10 mx-auto">
        <div className="max-w-[900px] mx-auto">
          <Text className="w-full text-4xl font-bold mb-4 bg-transparent outline-none focus:underline">
            {adventureLog.title}
          </Text>
          <hr className="border-b-1 border-dashed mb-4" />
          <div className="flex flex-row items-start">
            <div className="w-1/2">
              <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider">
                {adventureLog.location?.name}
              </Text>
              {adventureLog.location?.longitude &&
              adventureLog.location.latitude ? (
                <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-16">
                  {adventureLog.location.longitude},{" "}
                  {adventureLog.location.latitude}
                </Text>
              ) : null}
            </div>
            <Text className="w-full text-sm text-right">
              By <span className="italic">{adventureLog.user?.name}</span>
            </Text>
          </div>
        </div>
        {adventureLog.coverImageFileId ? (
          <ImageBlock fileId={adventureLog.coverImageFileId} className="mb-8" />
        ) : null}

        <AdventureLogBlocks adventureLogId={id as Id<"adventureLogs">} />
      </div>
      <div className="p-8 flex justify-center items-center w-full lg:z-50 lg:w-auto lg:flex-col lg:fixed lg:top-[50vh] lg:h-[1px] lg:right-0  ">
        <div className="flex flex-row lg:flex-col gap-4">
          <Link
            href={`/adventure-logs/${id as string}/edit`}
            className="bg-background border rounded-full p-3 hover:bg-muted"
          >
            <Pencil className="w-4 h-4 " />
          </Link>
          <AdventureLogLikeButton adventureLogId={id as Id<"adventureLogs">} />
          <Link
            href={`/adventure-logs/${id as string}/edit`}
            className="bg-background border rounded-full p-3 hover:bg-muted"
          >
            <MessageCircle className="w-4 h-4 " />
          </Link>
        </div>
      </div>
    </>
  );
}

function AdventureLogLikeButton({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const userLikesAdventureLog = useQuery(
    api.likes.findBySessionedUserAndAdventureLogId,
    {
      adventureLogId,
    }
  );
  const toggleLikeAdventureLog = useMutation(
    api.likes.toggleLikeBySessionedUserAndAdventureLogId
  );

  return (
    <button
      type="button"
      className={cn(
        "bg-background border rounded-full p-3 hover:bg-muted",
        userLikesAdventureLog && "text-red-500"
      )}
      onClick={() => {
        void toggleLikeAdventureLog({
          adventureLogId,
        });
      }}
    >
      <Heart
        className="w-4 h-4"
        fill={userLikesAdventureLog ? "red" : "transparent"}
      />
    </button>
  );
}
