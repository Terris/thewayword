"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { type FieldProps, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Input,
  Label,
  LoadingScreen,
  Switch,
  Text,
  Textarea,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { type Id, api } from "@repo/convex";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  priceInCents: Yup.string().required("Price is required"),
  description: Yup.string(),
  published: Yup.boolean(),
});

interface EditShopProductFormValues {
  name: string;
  priceInCents: string;
  description: string;
  published: boolean;
}

export function EditShopProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const { id } = useParams();
  const router = useRouter();

  const product = useQuery(api.shopProducts.findById, {
    id: id as Id<"shopProducts">,
  });

  const isLoading = product === undefined;
  const editShopProduct = useMutation(api.shopProducts.editById);

  async function onSubmit(values: EditShopProductFormValues) {
    try {
      await editShopProduct({
        id: id as Id<"shopProducts">,
        name: values.name,
        priceInCents: parseInt(values.priceInCents),
        description: values.description,
        published: values.published,
      });
      toast({
        title: "Success",
        description: "Product was updated",
      });
      onSuccess?.();
      router.push("/admin/products");
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

  if (isLoading) return <LoadingScreen />;

  return (
    <Formik<EditShopProductFormValues>
      initialValues={{
        name: product?.name ?? "",
        priceInCents: product?.priceInCents.toString() ?? "",
        description: product?.description ?? "",
        published: product?.published ?? false,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <Form className=" flex flex-col gap-4">
          <Text className="text-xl font-black">Edit Shop Product</Text>
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
          <Field name="published">
            {({ form, field }: FieldProps) => (
              <div className="flex flex-row items center gap-2">
                Published?
                <Switch
                  {...field}
                  checked={field.value as boolean}
                  onCheckedChange={(v) => {
                    void form.setFieldValue("published", v);
                  }}
                />
              </div>
            )}
          </Field>
          <Button
            type="submit"
            disabled={!dirty || !isValid || isSubmitting}
            className="mb-4"
          >
            Update product details
          </Button>
        </Form>
      )}
    </Formik>
  );
}
