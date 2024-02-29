"use client";

import { type Id, api } from "@repo/convex";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateLogPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findById, queryArgs);
  const isLoading = adventureLog === undefined;

  const [title, setTitle] = useState(adventureLog?.title ?? "");

  const updateAdventureLog = useMutation(api.adventureLogs.update);
  const canUpdateAdventureLog = title !== adventureLog?.title && title !== "";

  useEffect(() => {
    if (!adventureLog?.title) return;
    adventureLog.title && setTitle(adventureLog.title);
  }, [adventureLog?.title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canUpdateAdventureLog) return;
    try {
      await updateAdventureLog({ id: id as Id<"adventureLogs">, title });
      toast({
        title: "Success",
        description: "Saved adventure log",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  async function handlePublish() {
    if (canUpdateAdventureLog) return;
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        title,
        published: true,
      });
      toast({
        title: "Success",
        description: "Published adventure log",
      });
      router.push(`/adventure-logs/${id as string}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full max-w-[1024px]  p-8 mx-auto">
      <form className="w-full" onSubmit={handleSubmit}>
        {adventureLog?.location?.name ? (
          <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
            {adventureLog.location.name}
          </Text>
        ) : null}

        <input
          className="w-full text-4xl mb-8 bg-transparent outline-none focus:underline"
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />

        <hr className="border-b-1 border-dashed mb-4" />

        {adventureLog?.location?.longitude && adventureLog.location.latitude ? (
          <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
            {adventureLog.location.longitude}, {adventureLog.location.latitude}
          </Text>
        ) : null}

        <div className="flex flex-row gap-4">
          <Button
            type="submit"
            className="mt-16"
            disabled={!canUpdateAdventureLog}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            className="mt-16"
            disabled={canUpdateAdventureLog}
            onClick={() => {
              void handlePublish();
            }}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}
