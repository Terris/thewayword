"use client";

import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { type Id, api } from "@repo/convex";
import {
  Button,
  LoadingScreen,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { ImageBlock } from "../../../_components/ImageBlock";
import { AddImageBlockButton } from "./AddImageBlockButton";
import { AddTextBlockButton } from "./AddTextBlockButton";
import { EditableAdventureLogBlocks } from "./EditableAdventureLogBlocks";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  coverImageFileId: Yup.string(),
});

interface EditAdventureLogFormValues {
  title: string;
  coverImageFileId?: string;
}

export default function EditLogPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findById, queryArgs);
  const isLoading = adventureLog === undefined;
  const updateAdventureLog = useMutation(api.adventureLogs.update);

  // Submitting the form only updates the record as a draft
  async function onSubmit(values: EditAdventureLogFormValues) {
    if (values.title === adventureLog?.title || values.title === "") return;
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        title: values.title,
      });
      toast({
        title: "Success",
        description: "Saved draft adventure log",
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

  // Publish does not save any field updates
  async function handlePublish() {
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
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
    <Formik<EditAdventureLogFormValues>
      initialValues={{
        title: adventureLog?.title ?? "Untitled log",
        coverImageFileId: adventureLog?.coverImageFileId,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, isSubmitting, submitForm }) => {
        const canUpdateAdventureLog =
          values.title !== adventureLog?.title && values.title !== "";

        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="pb-32 absolute top-0 left-0 right-0 bg-background">
              <div className="w-full p-8 flex flex-row items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.back();
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  disabled={!canUpdateAdventureLog || isSubmitting}
                  className="ml-auto"
                  onClick={() => {
                    void submitForm();
                  }}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  disabled={canUpdateAdventureLog || isSubmitting}
                  onClick={() => {
                    void handlePublish();
                  }}
                >
                  Publish
                </Button>
              </div>

              <div className="w-full max-w-[1024px] p-8 pt-0 mx-auto">
                <Field name="title">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <Tooltip defaultOpen>
                        <TooltipTrigger className="w-full">
                          <input
                            className="w-full text-4xl mb-4 bg-transparent outline-none focus:underline"
                            {...field}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          Start by giving this log a title.
                        </TooltipContent>
                      </Tooltip>

                      {meta.touched && meta.error ? (
                        <Text className="text-destructive">{meta.error}</Text>
                      ) : null}
                    </>
                  )}
                </Field>

                <hr className="border-b-1 border-dashed mb-4" />
                {adventureLog?.location?.name ? (
                  <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider">
                    {adventureLog.location.name}
                  </Text>
                ) : null}
                {adventureLog?.location?.longitude &&
                adventureLog.location.latitude ? (
                  <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-8">
                    {adventureLog.location.longitude},{" "}
                    {adventureLog.location.latitude}
                  </Text>
                ) : null}

                {adventureLog?.coverImageFileId ? (
                  <ImageBlock
                    fileId={adventureLog.coverImageFileId}
                    className="mb-8"
                  />
                ) : null}

                <EditableAdventureLogBlocks
                  adventureLogId={id as Id<"adventureLogs">}
                />

                <div className="border border-dashed rounded p-2 flex flex-row items-center justify-center gap-2">
                  <AddImageBlockButton
                    adventureLogId={id as Id<"adventureLogs">}
                  />
                  <AddTextBlockButton
                    adventureLogId={id as Id<"adventureLogs">}
                  />
                </div>
              </div>
              {/* TODO: This is a fixed right sidebar that is meant to help with editing and adding blocks */}
              {/* <div className="fixed top-[50%] right-0 w-1/6 h-1 flex flex-col justify-center">
                <div className="border border-dashed p-4 rounded-tl rounded-bl flex flex-col gap-2 min-h-[300px]">
                  <Text className="font-soleil font-bold text-sm tracking-wide pb-4">
                    ADD A BLOCK
                  </Text>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start"
                  >
                    Text
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start"
                  >
                    Image
                  </Button>
                </div>
              </div> */}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
