"use client";

import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { Button, LoadingScreen, Switch, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { ImageBlock } from "../../../_components/ImageBlock";
import { AddImageBlockButton } from "./AddImageBlockButton";
import { AddTextBlockButton } from "./AddTextBlockButton";
import { EditableAdventureLogBlocks } from "./EditableAdventureLogBlocks";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  coverImageFileId: Yup.string(),
  published: Yup.boolean().required(),
});

interface EditAdventureLogFormValues {
  title: string;
  coverImageFileId?: string;
  published: boolean;
}

export default function EditLogPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findByIdAsOwner, queryArgs);
  const isLoading = adventureLog === undefined;
  const updateAdventureLog = useMutation(api.adventureLogs.update);

  async function onSubmit(values: EditAdventureLogFormValues) {
    if (values.title === "") return;
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        title: values.title,
        published: values.published,
      });
      toast({
        title: "Success",
        description: "Saved changes",
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

  if (isLoading) return <LoadingScreen />;

  return (
    <Formik<EditAdventureLogFormValues>
      initialValues={{
        title: adventureLog.title,
        coverImageFileId: adventureLog.coverImageFileId,
        published: adventureLog.published,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="pb-32 absolute top-0 left-0 right-0 bg-background">
              <div className="w-full p-8 flex flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.back();
                    }}
                    disabled={isSubmitting}
                    className="mr-auto"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="w-full md:w-1/2 flex flex-row items-center justify-end gap-2">
                  <Field name="published">
                    {({ form, field }: FieldProps) => (
                      <>
                        Published
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={(v) => {
                            void form.setFieldValue("published", v);
                            setTimeout(() => {
                              void submitForm();
                            });
                          }}
                          {...field}
                        />
                      </>
                    )}
                  </Field>
                </div>
                <Button
                  type="button"
                  disabled={isSubmitting}
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
                    <Field name="title">
                      {({ field, meta }: FieldProps) => (
                        <>
                          <input
                            className="w-full text-4xl font-bold mb-4 bg-transparent outline-none focus:underline"
                            {...field}
                            onChange={(v) => {
                              field.onChange(v);
                              setTimeout(() => {
                                void submitForm();
                              }, 500);
                            }}
                          />
                          {meta.touched && meta.error ? (
                            <Text className="text-destructive">
                              {meta.error}
                            </Text>
                          ) : null}
                        </>
                      )}
                    </Field>
                  </div>
                </div>
                <div className="flex flex-col pb-8 md:flex-row md:gap-8">
                  <div className="md:w-1/12 md:text-right">
                    <Text className="italic text-neutral-400">Location</Text>
                  </div>
                  <div className="w-11/12">
                    {adventureLog.location?.name ? (
                      <Text className="font-soleil uppercase text-xs text-muted-foreground font-semibold tracking-wider pt-1">
                        {adventureLog.location.name}
                      </Text>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="md:w-1/12 md:text-right">
                    <Text className="italic text-neutral-400">Cover image</Text>
                  </div>
                  <div className="w-11/12">
                    {adventureLog.coverImageFileId ? (
                      <ImageBlock
                        fileId={adventureLog.coverImageFileId}
                        className="mb-8"
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8 pb-8">
                  <div className="md:w-1/12 md:text-right">
                    <Text className="italic text-neutral-400">
                      Story blocks
                    </Text>
                  </div>
                  <div className="w-11/12">
                    <EditableAdventureLogBlocks
                      adventureLogId={id as Id<"adventureLogs">}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:gap-8">
                  <div className="md:w-1/12 md:text-right">
                    <Text className="italic text-neutral-400">Add a block</Text>
                  </div>
                  <div className="w-11/12">
                    <div className="border border-dashed rounded p-2 flex flex-row items-center justify-center gap-2">
                      <AddImageBlockButton
                        adventureLogId={id as Id<"adventureLogs">}
                      />
                      <AddTextBlockButton
                        adventureLogId={id as Id<"adventureLogs">}
                      />
                    </div>
                  </div>
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
