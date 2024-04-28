"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import {
  Field,
  Form,
  Formik,
  type FormikHelpers,
  type FieldProps,
} from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, LoadingScreen, Text } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";
import { useQuery } from "convex/react";
import { type Id, api } from "@repo/convex";

const signUpValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
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
  code?: string;
}

const verifyValidationSchema = Yup.object().shape({
  verificationCode: Yup.string().required("Verification code is required"),
});

interface VerifyFormValues {
  verificationCode: string;
}

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");
  const invite = useQuery(api.invites.findById, {
    id: inviteToken as Id<"invites">,
  });
  const inviteIsLoading = invite === undefined;

  const { isAuthenticated, isLoading: authIsLoading } = useMeContext();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded: convexIsLoaded, signUp, setActive } = useSignUp();
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/onboard");
    }
  }, [isAuthenticated, router]);

  async function onSubmit(
    values: SignUpFormValues,
    helpers: FormikHelpers<SignUpFormValues>
  ) {
    if (!convexIsLoaded) return;
    if (invite?.email !== values.email) {
      toast({
        title: "Sign in failed",
        description:
          "You must sign up with the same email as one we sent your invite to.",
        variant: "destructive",
      });
      return;
    }

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      helpers.resetForm();
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
    if (!convexIsLoaded) return;

    try {
      // Submit the code that the user provides to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.verificationCode,
      });

      if (completeSignUp.status !== "complete") {
        throw new Error("Verification failed. Please try again.");
      }

      await setActive({ session: completeSignUp.createdSessionId });
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

  if (inviteIsLoading) return <LoadingScreen />;

  if (!inviteToken) {
    return (
      <div className="w-full p-8">
        <Text className="text-2xl text-center">
          Sorry, you can&rsquo;t do that yet.
        </Text>
        <Text className="text-center">You must have an invite to sign up.</Text>
      </div>
    );
  }

  return verifying ? (
    <Formik<VerifyFormValues>
      initialValues={{
        verificationCode: "",
      }}
      validationSchema={verifyValidationSchema}
      onSubmit={onVerify}
    >
      {({ isSubmitting, submitForm, dirty, isValid }) => (
        <Form className="w-[600px] p-8 mx-auto flex flex-col gap-4">
          <Text className="text-xl font-black">Sign in</Text>
          <Text>Nice! We sent you an email with a verfication code.</Text>
          <Field name="verificationCode">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Verification code</Label>
                <Input key="verificationCode" className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Button
            type="button"
            disabled={
              !convexIsLoaded ||
              authIsLoading ||
              !dirty ||
              !isValid ||
              isSubmitting
            }
            onClick={() => {
              void submitForm();
            }}
          >
            Verify
          </Button>
        </Form>
      )}
    </Formik>
  ) : (
    <Formik<SignUpFormValues>
      initialValues={{
        email: "",
        password: "",
        passwordConfirmation: "",
        code: "",
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
                <Input className="w-full" type="email" {...field} />
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
