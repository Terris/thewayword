"use client";

import { api } from "@repo/convex";
import { useQuery } from "convex/react";
import { LoadingScreen, Text } from "@repo/ui";
import Link from "next/link";
import { AdventureLogShowcaseImage } from "../../../_components/AdventureLogShowcaseImage";

export default function MeAdventureLogsPage() {
  const adventureLogs = useQuery(
    api.adventureLogs.findAllDraftsBySessionedUser
  );

  const isLoading = adventureLogs === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="w-full py-8 grid grid-cols-4 gap-8">
        {adventureLogs.map((adventureLog) => (
          <Link
            key={adventureLog._id}
            href={`/adventure-logs/${adventureLog._id}`}
            className="w-full border border-dashed rounded pb-8 cursor-pointer hover:border-muted transition-all"
          >
            <AdventureLogShowcaseImage
              showcaseFileId={adventureLog.showcaseFileId}
              className="pb-8"
            />
            <div className="p-4">
              <Text className="text-center font-black text-xl pb-4">
                {adventureLog.title}
              </Text>
              <hr className="w-[30px] mx-auto mb-4" />
              <Text className="font-soleil text-center font-bold uppercase text-xs tracking-wider pb-2">
                {adventureLog.location?.name}
              </Text>
              <Text className="text-center text-xs">
                {adventureLog.location?.latitude},{" "}
                {adventureLog.location?.longitude}
              </Text>
            </div>
          </Link>
        ))}
      </div>
      {!adventureLogs.length && (
        <Text className="text-center">Ohp, nothing here at the moment.</Text>
      )}
    </>
  );
}
