"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { cn } from "@repo/utils";
import { AddImageBlockButton } from "./AddImageBlockButton";
import { AddTextBlockButton } from "./AddTextBlockButton";
import { EditableAdventureLogBlocks } from "./EditableAdventureLogBlocks";
import { EditableIsPublicForm } from "./EditableIsPublicForm";
import { EditableTitleForm } from "./EditableTitleForm";
import { EditableAdventureDateForm } from "./EditableAdventureDateForm";
import { EditableLocationForm } from "./EditableLocationForm";
import { EditableAdventureLogTags } from "./EditableAdventureLogTags";
import { DeleteAdventureLogButton } from "./DeleteAdventureLogButton";

export default function EditLogPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findByIdAsOwner, queryArgs);
  const isLoading = adventureLog === undefined;
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savingTimeout = setTimeout(() => {
      setIsSaving(false);
    }, 1000);

    return () => {
      clearTimeout(savingTimeout);
    };
  }, [isSaving]);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <div className="pb-32 absolute top-0 left-0 right-0 bg-background">
        <div className="w-full container p-8 flex flex-row items-center justify-end gap-8">
          <EditableIsPublicForm setIsSaving={setIsSaving} />
          <Button
            type="button"
            // disabled={isSubmitting}
            onClick={() => {
              router.push(`/adventure-logs/${id as string}`);
            }}
          >
            Done
          </Button>
        </div>

        <div className="w-full container p-8 pt-0 mx-auto">
          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="md:w-1/12 md:text-right">
              <Text className="italic text-neutral-400 pt-1">Title</Text>
            </div>
            <div className="md:w-11/12">
              <EditableTitleForm setIsSaving={setIsSaving} />
            </div>
          </div>
          <div className="flex flex-col pb-4 md:flex-row md:gap-8">
            <div className="md:w-1/12 md:text-right">
              <Text className="italic text-neutral-400">Location</Text>
            </div>
            <div className="md:w-11/12">
              <EditableLocationForm setIsSaving={setIsSaving} />
            </div>
          </div>
          <div className="flex flex-col pb-4 md:flex-row md:gap-8">
            <div className="md:w-1/12 md:text-right">
              <Text className="italic text-neutral-400">Date</Text>
            </div>
            <div className="md:w-11/12">
              <EditableAdventureDateForm setIsSaving={setIsSaving} />
            </div>
          </div>
          <div className="flex flex-col pb-4 md:flex-row md:gap-8">
            <div className="md:w-1/12 md:text-right">
              <Text className="italic text-neutral-400">Tags</Text>
            </div>
            <div className="md:w-11/12">
              <EditableAdventureLogTags setIsSaving={setIsSaving} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:gap-8 pb-32">
            <div className="md:mb-0 md:w-1/12 md:text-right">
              <Text className="italic text-neutral-400">Your story</Text>
            </div>
            <div className="md:w-11/12 md:pt-1">
              <EditableAdventureLogBlocks />
              <hr className="w-fill border-dashed mt-4" />
              <div className="w-[200px] mx-auto -mt-[29px] bg-background border border-dashed rounded-xl p-2 flex flex-row items-center justify-center gap-2">
                <AddImageBlockButton
                  adventureLogId={id as Id<"adventureLogs">}
                />
                <AddTextBlockButton
                  adventureLogId={id as Id<"adventureLogs">}
                />
              </div>
            </div>
          </div>
          <DeleteAdventureLogButton
            adventureLogId={id as Id<"adventureLogs">}
          />
        </div>
      </div>

      <div
        className={cn(
          "hidden fixed top-0 left-0 w-full h-[4px] bg-primary",
          isSaving && "block animate-pulse"
        )}
      />
    </>
  );
}
