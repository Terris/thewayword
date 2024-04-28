"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, Text } from "@repo/ui";

const signUpValidationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least eight characters")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
});

interface SignUpFormValues {
  email: string;
  password: string;
  passwordConfirmation: string;
}

const verifyValidationSchema = Yup.object().shape({
  code: Yup.string().required("Verification code is required"),
});

interface VerifyFormValues {
  code: string;
}

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);

  async function onSubmit(values: SignUpFormValues) {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display second form and capture the OTP code
      setVerifying(true);
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

  async function onVerify(values: VerifyFormValues) {
    if (!isLoaded) return;

    try {
      // Submit the code that the user provides to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp.status !== "complete") {
        throw new Error("Verification failed. Please try again.");
      }

      await setActive({ session: completeSignUp.createdSessionId });
      // Redirect the user to a post sign-up route
      router.push("/feed");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Sign un failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (verifying) {
    return (
      <Formik<VerifyFormValues>
        initialValues={{
          code: "",
        }}
        validationSchema={verifyValidationSchema}
        onSubmit={onVerify}
      >
        {({ isSubmitting, submitForm, dirty, isValid }) => (
          <Form className="w-[600px] p-8 mx-auto flex flex-col gap-4">
            <Text className="text-xl font-black">Sign in</Text>
            <Text>Nice! We sent you an email with a verfication code.</Text>
            <Field name="code">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Verification code</Label>
                  <Input className="w-full" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
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
              Verify
            </Button>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Formik<SignUpFormValues>
      initialValues={{
        email: "",
        password: "",
        passwordConfirmation: "",
      }}
      validationSchema={signUpValidationSchema}
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
                <Input className="w-full" type="password" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Field name="passwordConfirmation">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Confirm Password</Label>
                <Input className="w-full" type="password" {...field} />
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
            Sign up
          </Button>
        </Form>
      )}
    </Formik>
  );
}
