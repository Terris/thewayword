"use client";

import {
  type FieldProps,
  type FormikHelpers,
  Field,
  Form,
  Formik,
} from "formik";
import * as Yup from "yup";
import { Button, Input, Label, Text, Textarea } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useMutation } from "convex/react";
import { api } from "@repo/convex";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  priceInCents: Yup.string().required("Price is required"),
  description: Yup.string(),
});

interface CreateShopProductFormValues {
  name: string;
  priceInCents: string;
  description: string;
}

export function CreateShopProductForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { toast } = useToast();
  const createShopProduct = useMutation(api.shopProducts.create);

  async function onSubmit(
    values: CreateShopProductFormValues,
    helpers: FormikHelpers<CreateShopProductFormValues>
  ) {
    try {
      await createShopProduct({
        name: values.name,
        priceInCents: parseInt(values.priceInCents),
        description: values.description,
        published: true,
      });
      toast({
        title: "Success",
        description: "Product was created",
      });
      helpers.resetForm();
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error creating product",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <Formik<CreateShopProductFormValues>
      initialValues={{
        name: "",
        priceInCents: "",
        description: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className=" flex flex-col gap-4">
          <Text className="text-xl font-black">Create Shop Product</Text>
          <Field name="name">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Product name</Label>
                <Input className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Field name="priceInCents">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Price in cents</Label>
                <Input className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Field name="description">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Description</Label>
                <Textarea {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
                ) : null}
              </div>
            )}
          </Field>
          <Button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            className="mb-4"
          >
            Create product
          </Button>
        </Form>
      )}
    </Formik>
  );
}
