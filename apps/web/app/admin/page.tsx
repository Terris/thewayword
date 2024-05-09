"use client";

import {
  Field,
  Form,
  Formik,
  type FormikHelpers,
  type FieldProps,
} from "formik";
import * as Yup from "yup";
import { PrivatePageWrapper } from "@repo/auth";
import { Button, Input, Label, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";

export default function AdminPage() {
  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      <div className="w-full p-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        <InviteForm />
      </div>
    </PrivatePageWrapper>
  );
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
});

interface InviteFormValues {
  email: string;
}

function InviteForm() {
  const { toast } = useToast();
  const createInvite = useMutation(api.invites.create);

  async function onSubmit(
    values: InviteFormValues,
    helpers: FormikHelpers<InviteFormValues>
  ) {
    try {
      // create invite
      await createInvite({
        email: values.email,
      });
      helpers.resetForm();
      toast({
        title: "Invite created",
        description: "The invite has been created",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Failed to create invite",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<InviteFormValues>
      initialValues={{
        email: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <Form className="flex flex-col gap-2">
          <Text className="text-xl font-black">Send Invite</Text>
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

          <Button type="submit" disabled={!dirty || isSubmitting}>
            Send invite
          </Button>
        </Form>
      )}
    </Formik>
  );
}
