"use client";

import { useRouter } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Label, Text, Textarea } from "@repo/ui";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";

const validationSchema = Yup.object().shape({
  message: Yup.string().required("Message is required"),
});

interface FeedbackFormValues {
  message: string;
}

export default function FeedbackPage() {
  const router = useRouter();
  const { toast } = useToast();

  const createFeedback = useMutation(api.feedback.create);

  async function onSubmit(values: FeedbackFormValues) {
    try {
      await createFeedback({ message: values.message });
      router.push("/feedback/success");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<FeedbackFormValues>
      initialValues={{
        message: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="w-full max-w-[600px] p-8 mx-auto flex flex-col gap-4">
          <Text className="text-xl font-black">Provide feedback</Text>
          <Text>
            At The WayWord, we want to make a product you love using. So, if you
            feel that there is something—anything—that you think we can do
            better, please let us know. We greatly appreciate your time and
            input.
          </Text>
          <Field name="message">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Your feedback</Label>
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
