"use client";

import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
});

interface TitleFormValues {
  title: string;
}

export function EditableTitleForm({
  setIsSaving,
}: {
  setIsSaving: (value: boolean) => void;
}) {
  const { id } = useParams();
  const { toast } = useToast();
  const queryArgs = id ? { id: id as Id<"adventureLogs"> } : "skip";
  const adventureLog = useQuery(api.adventureLogs.findByIdAsOwner, queryArgs);
  const isLoading = adventureLog === undefined;
  const updateAdventureLog = useMutation(api.adventureLogs.update);

  async function onSubmit(values: TitleFormValues) {
    if (values.title === "") return;
    setIsSaving(true);
    try {
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        title: values.title,
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
    <Formik<TitleFormValues>
      initialValues={{
        title: adventureLog.title,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => {
        return (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Field name="title">
              {({ field, meta }: FieldProps) => (
                <>
                  <input
                    className="w-full md:text-4xl font-bold mb-4 bg-transparent outline-none hover:underline focus:underline"
                    {...field}
                    onChange={(v) => {
                      field.onChange(v);
                      setTimeout(() => {
                        void submitForm();
                      }, 500);
                    }}
                  />
                  {meta.touched && meta.error ? (
                    <Text className="text-destructive">{meta.error}</Text>
                  ) : null}
                </>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
}
