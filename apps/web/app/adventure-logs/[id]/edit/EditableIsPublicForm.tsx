"use client";

import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { LoadingScreen, Switch } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";

const validationSchema = Yup.object().shape({
  isPublic: Yup.boolean().required(),
});

interface IsPublicFormValues {
  isPublic: boolean;
}

export function EditableIsPublicForm({
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

  async function onSubmit(values: IsPublicFormValues) {
    try {
      setIsSaving(true);
      await updateAdventureLog({
        id: id as Id<"adventureLogs">,
        isPublic: values.isPublic,
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
    <Formik<IsPublicFormValues>
      initialValues={{
        isPublic: adventureLog.isPublic,
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
            <Field name="isPublic">
              {({ form, field }: FieldProps) => (
                <div className="flex flex-row items center gap-2">
                  Public log?
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={(v) => {
                      void form.setFieldValue("isPublic", v);
                      setTimeout(() => {
                        void submitForm();
                      });
                    }}
                    {...field}
                  />
                </div>
              )}
            </Field>
          </Form>
        );
      }}
    </Formik>
  );
}
