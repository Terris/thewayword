"use client";

import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { Button, LoadingScreen, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { ImageBlock } from "../../../_components/ImageBlock";
import { AddImageBlockButton } from "./AddImageBlockButton";
import { EditableBlock } from "./EditableBlock";

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
          <Form>
            <div className="absolute top-0 left-0 right-0 bg-background">
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
                {adventureLog?.location?.name ? (
                  <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pb-4">
                    {adventureLog.location.name}
                  </Text>
                ) : null}
                <Field name="title">
                  {({ field, meta }: FieldProps) => (
                    <>
                      <input
                        className="w-full text-4xl mb-4 bg-transparent outline-none focus:underline"
                        {...field}
                      />
                      {meta.touched && meta.error ? (
                        <Text className="text-destructive">{meta.error}</Text>
                      ) : null}
                    </>
                  )}
                </Field>

                <hr className="border-b-1 border-dashed mb-4" />

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

                {adventureLog?.blocks?.map((block) => (
                  <div
                    key={`block-${block.type}-${block.order}`}
                    className="pb-8"
                  >
                    <EditableBlock block={block} />
                  </div>
                ))}

                <div className="border border-dashed rounded p-1 flex flex-row items-center justify-center gap-2">
                  <AddImageBlockButton
                    adventureLogId={id as Id<"adventureLogs">}
                  />
                </div>
              </div>
              <div className="fixed top-[50%] right-0 w-1/6 h-1 flex flex-col">
                <div className="border border-dashed p-4 rounded-tl rounded-bl">
                  <Text className="font-soleil font-bold text-sm tracking-wide">
                    ADD A BLOCK
                  </Text>
                </div>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
