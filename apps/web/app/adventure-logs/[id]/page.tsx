"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { MessageCircle, Pencil } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { Block } from "./Block";
import { ImageBlock } from "./ImageBlock";

export default function AdventureLogPage() {
  const { id } = useParams();
  const adventureLog = useQuery(api.adventureLogs.findById, {
    id: id as Id<"adventureLogs">,
  });

  const isLoading = adventureLog === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="w-full max-w-[1024px] p-8 mx-auto">
        <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-4">
          {adventureLog?.location?.name}
        </Text>
        <Text className="w-full text-4xl mb-4 bg-transparent outline-none focus:underline">
          {adventureLog?.title}
        </Text>
        <hr className="border-b-1 border-dashed mb-4" />
        {adventureLog?.location?.longitude && adventureLog.location.latitude ? (
          <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
            {adventureLog.location.longitude}, {adventureLog.location.latitude}
          </Text>
        ) : null}

        {adventureLog?.showcaseFileId ? (
          <ImageBlock fileId={adventureLog.showcaseFileId} />
        ) : null}

        {adventureLog?.blocks?.map((block) => (
          <div key={`block-${block.type}-${block.order}`} className="pb-8">
            <Block block={block} />
          </div>
        ))}
      </div>
      <div className="fixed top-[50vh] h-[1px] right-0 p-8 flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4">
          <Link
            href={`/adventure-logs/${id as string}/edit`}
            type="button"
            className="border rounded-full p-3"
          >
            <Pencil className="w-4 h-4 " />
          </Link>
          <Link
            href={`/adventure-logs/${id as string}/edit`}
            type="button"
            className="border rounded-full p-3"
          >
            <MessageCircle className="w-4 h-4 " />
          </Link>
        </div>
      </div>
    </>
  );
}
