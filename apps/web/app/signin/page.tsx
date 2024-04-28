"use client";

import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, Text } from "@repo/ui";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(values: SignInFormValues) {
    if (!isLoaded) return;
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/feed");
      } else {
        throw new Error(`${result.status}`);
      }
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
    <Formik<SignInFormValues>
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, submitForm, dirty, isValid }) => (
        <Form className="w-[600px] p-8 mx-auto flex flex-col gap-4">
          <Text className="text-xl font-black">Sign in</Text>
          <Field name="email">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Email</Label>
                <Input className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Field name="password">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Password</Label>
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
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
}
