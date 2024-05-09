"use client";

import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn } from "@clerk/nextjs";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, LoadingScreen, Text } from "@repo/ui";
import {
  type FormikHelpers,
  type FieldProps,
  Field,
  Form,
  Formik,
} from "formik";

const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
});

interface ForgotPasswordFormValues {
  email: string;
}

const verifyAndResetPasswordValidationSchema = Yup.object().shape({
  verificationCode: Yup.string().required("Verification code is required"),
  newPassword: Yup.string()
    .min(8, "Password must be at least eight characters")
    .required("Password is required"),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Password confirmation is required"),
});

interface VerifyAndResetPasswordFormValues {
  verificationCode: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [resetCodeSent, setResetCodeSent] = useState(false);

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/feed");
    }
  }, [isSignedIn, router]);

  async function onSubmitEmail(
    values: ForgotPasswordFormValues,
    helpers: FormikHelpers<ForgotPasswordFormValues>
  ) {
    if (!signIn) return;
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.email,
      });
      setResetCodeSent(true);
      helpers.resetForm();
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

  async function onSubmitVerifyAndChangePassword(
    values: VerifyAndResetPasswordFormValues
  ) {
    if (!signIn) return;
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: values.verificationCode,
        password: values.newPassword,
      });
      if (result.status === "complete") {
        void setActive({ session: result.createdSessionId });
      } else {
        throw new Error(`Unexpected status: ${result.status}`);
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

  if (!isLoaded) return <LoadingScreen />;

  return (
    <div className="w-full max-w-[600px] p-8 mx-auto flex flex-col gap-4">
      <Text className="text-xl font-black">Forgot Password?</Text>
      {resetCodeSent ? (
        <Formik<VerifyAndResetPasswordFormValues>
          initialValues={{
            verificationCode: "",
            newPassword: "",
            newPasswordConfirmation: "",
          }}
          validationSchema={verifyAndResetPasswordValidationSchema}
          onSubmit={onSubmitVerifyAndChangePassword}
        >
          {({ isSubmitting, submitForm, dirty, isValid }) => (
            <Form className="flex flex-col gap-4">
              <Field name="verificationCode">
                {({ field, meta }: FieldProps) => (
                  <div>
                    <Label htmlFor={field.name}>Verification code</Label>
                    <Input
                      key="verificationCode"
                      className="w-full"
                      {...field}
                    />
                    {meta.touched && meta.error ? (
                      <Text className="text-sm text-destructive">
                        {meta.error}
                      </Text>
                    ) : null}
                  </div>
                )}
              </Field>
              <Field name="newPassword">
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
              <Field name="newPasswordConfirmation">
                {({ field, meta }: FieldProps) => (
                  <div>
                    <Label htmlFor={field.name}>Confirm Password</Label>
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
                type="button"
                disabled={!dirty || !isValid || isSubmitting}
                onClick={() => {
                  void submitForm();
                }}
              >
                Change password and sign in
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik<ForgotPasswordFormValues>
          initialValues={{
            email: "",
          }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={onSubmitEmail}
        >
          {({ isSubmitting, submitForm, dirty, isValid }) => (
            <Form className="flex flex-col gap-4">
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
              <Button
                type="button"
                disabled={!dirty || !isValid || isSubmitting}
                onClick={() => {
                  void submitForm();
                }}
              >
                Send password reset code
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
