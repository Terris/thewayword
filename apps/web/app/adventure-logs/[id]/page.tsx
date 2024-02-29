"use client";

import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

export default function AdventureLogPage() {
  const { id } = useParams();
  const adventureLog = useQuery(api.adventureLogs.findById, {
    id: id as Id<"adventureLogs">,
  });

  const isLoading = adventureLog === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full max-w-[1024px] p-8 mx-auto">
      <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
        {adventureLog?.location?.name}
      </Text>
      <Text className="w-full text-4xl mb-8 bg-transparent outline-none focus:underline">
        {adventureLog?.title}
      </Text>
      <hr className="border-b-1 border-dashed mb-4" />
      {adventureLog?.location?.longitude && adventureLog.location.latitude ? (
        <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
          {adventureLog.location.longitude}, {adventureLog.location.latitude}
        </Text>
      ) : null}
    </div>
  );
}
