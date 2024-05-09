"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import Link from "next/link";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface SignInFormValues {
  email: string;
  password: string;
}

export default function SignInPage() {
  const { isAuthenticated, isLoading: authIsLoading } = useMeContext();
  const { isLoaded: convexIsLoaded, signIn, setActive } = useSignIn();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated, router]);

  async function onSubmit(values: SignInFormValues) {
    if (!convexIsLoaded) return;
    try {
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        throw new Error("Incorrect email or password");
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
    <div className="w-full p-8 max-w-[600px] mx-auto">
      <Formik<SignInFormValues>
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className=" flex flex-col gap-4">
            <Text className="text-xl font-black">Sign in</Text>
            <Field name="email">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Email</Label>
                  <Input className="w-full" type="email" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
                  ) : null}
                </div>
              )}
            </Field>
            <Field name="password">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Password</Label>
                  <Input className="w-full" type="password" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
                  ) : null}
                </div>
              )}
            </Field>
            <Button
              type="submit"
              disabled={
                !convexIsLoaded ||
                authIsLoading ||
                !dirty ||
                !isValid ||
                isSubmitting
              }
              className="mb-4"
            >
              Sign in
            </Button>
          </Form>
        )}
      </Formik>
      <Text>
        <Link href="/forgot-password">Forgot password?</Link>
      </Text>
    </div>
  );
}
