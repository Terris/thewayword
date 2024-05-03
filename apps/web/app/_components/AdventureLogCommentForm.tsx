"use client";

import { Field, Form, Formik, FormikHelpers, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Label, Text, Textarea } from "@repo/ui";
import { type Id, api } from "@repo/convex";
import { useMutation } from "convex/react";

const validationSchema = Yup.object().shape({
  message: Yup.string().required("Your comment is required"),
});

interface AdventureLogCommentFormValues {
  message: string;
}

export function AdventureLogCommentForm({
  adventureLogId,
}: {
  adventureLogId: Id<"adventureLogs">;
}) {
  const { toast } = useToast();
  const createComment = useMutation(api.comments.create);

  async function onSubmit(
    values: AdventureLogCommentFormValues,
    helpers: FormikHelpers<AdventureLogCommentFormValues>
  ) {
    try {
      // create comment
      await createComment({
        adventureLogId,
        message: values.message,
      });
      helpers.resetForm();
      toast({
        title: "Success",
        description: "Comment created",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<AdventureLogCommentFormValues>
      initialValues={{
        message: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="w-full flex flex-col gap-4">
          <Field name="message">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Your Message</Label>
                <Textarea className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}
