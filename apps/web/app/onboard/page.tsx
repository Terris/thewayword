"use client";

import { useRouter } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, LoadingScreen, Text } from "@repo/ui";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
});

interface OnboardFormValues {
  name: string;
}

export default function OnboardPage() {
  const { isLoading, me } = useMeContext();
  const router = useRouter();
  const { toast } = useToast();
  const updateUser = useMutation(api.users.updateUserAsUserOwner);

  async function onSubmit(values: OnboardFormValues) {
    try {
      await updateUser({
        name: values.name,
      });
      router.push("/feed");
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

  if (isLoading || !me) return <LoadingScreen />;

  return (
    <Formik<OnboardFormValues>
      initialValues={{
        name: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, submitForm, dirty, isValid }) => (
        <Form className="w-[600px] p-8 mx-auto flex flex-col gap-4">
          <Text className="text-xl font-bold">
            Welcome! Please introduce yourself.
          </Text>
          <Field name="name">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Your name</Label>
                <Input className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Button
            type="button"
            disabled={!dirty || !isValid || isSubmitting}
            onClick={() => {
              void submitForm();
            }}
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
}
