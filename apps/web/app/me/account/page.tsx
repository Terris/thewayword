"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import { api } from "@repo/convex";
import { useMutation } from "convex/react";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface AccountFormValues {
  email: string;
}

export default function AccountPage() {
  const { isAuthenticated, isLoading: authIsLoading } = useMeContext();
  const updateUser = useMutation(api.users.updateUserAsUserOwner);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated, router]);

  async function onSubmit(values: AccountFormValues) {
    try {
      await updateUser({
        email: values.email,
      });
      toast({
        title: "Success!",
        description: "Account updated",
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
    <Formik<AccountFormValues>
      initialValues={{
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className="w-full max-w-[600px] p-8 mx-auto flex flex-col gap-4">
          <Text className="text-xl font-black">Sign in</Text>
          <Field name="email">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Email</Label>
                <Input className="w-full" type="email" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Button
            type="submit"
            disabled={authIsLoading || !dirty || !isValid || isSubmitting}
          >
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
}
