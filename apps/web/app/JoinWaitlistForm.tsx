"use client";

import * as Yup from "yup";
import type { FieldProps, FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import { Button, FieldError, Input } from "@repo/ui";
import { api } from "@repo/convex";
import { useMutation } from "convex/react";
import { useToast } from "@repo/ui/hooks";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address.")
    .required("Email is required."),
});

interface JoinWaitlistFormValues {
  email: string;
}

export function JoinWaitlistForm() {
  const { toast } = useToast();
  const addEmailToWaitlist = useMutation(api.waitlist.addEmailToWaitlist);

  async function onSubmit(
    values: JoinWaitlistFormValues,
    formikHelpers: FormikHelpers<JoinWaitlistFormValues>
  ) {
    // console.log(values);
    try {
      await addEmailToWaitlist({ email: values.email });
      toast({
        title: "Success!",
        description: "You've been added to the waitlist.",
      });
      formikHelpers.resetForm();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong.",
      });
    }
  }

  return (
    <Formik<JoinWaitlistFormValues>
      initialValues={{
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row items-start gap-2">
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <div className="w-full">
                  <Input placeholder="Enter your email" sizeY="lg" {...field} />
                  <FieldError touched={meta.touched} error={meta.error} />
                </div>
              )}
            </Field>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex-shrink-0"
            >
              Join Waitlist
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
