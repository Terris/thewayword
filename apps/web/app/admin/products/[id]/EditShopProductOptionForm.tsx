"use client";

import { useMutation, useQuery } from "convex/react";
import { type FieldProps, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Button, Input, Label, LoadingScreen, Text } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { type Id, api } from "@repo/convex";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  values: Yup.string().required("Values are required"),
});

interface EditShopProductFormValues {
  name: string;
  values: string;
}

export function EditShopProductOptionForm({
  onSuccess,
  shopProductOptionId,
}: {
  onSuccess?: () => void;
  shopProductOptionId: Id<"shopProductOptions">;
}) {
  const { toast } = useToast();

  const productOption = useQuery(api.shopProductOptions.findById, {
    id: shopProductOptionId,
  });

  const isLoading = productOption === undefined;
  const editShopProductOption = useMutation(api.shopProductOptions.editById);

  const deleteProductOption = useMutation(api.shopProductOptions.deleteById);

  async function onSubmit(values: EditShopProductFormValues) {
    try {
      await editShopProductOption({
        id: shopProductOptionId,
        name: values.name,
        values: values.values,
      });
      toast({
        title: "Success",
        description: "Product option was updated",
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error updating product option",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <Formik<EditShopProductFormValues>
        initialValues={{
          name: productOption?.name ?? "",
          values: productOption?.values.join(",") ?? "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form
            className=" flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Text className="text-xl font-black">Edit Shop Product</Text>
            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Product name</Label>
                  <Input className="w-full" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
                  ) : null}
                </div>
              )}
            </Field>
            <Field name="values">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Values</Label>
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
              type="submit"
              disabled={!dirty || !isValid || isSubmitting}
              className="mb-4"
            >
              Update product details
            </Button>
          </Form>
        )}
      </Formik>
      <Button
        type="button"
        variant="destructive"
        onClick={() => {
          void deleteProductOption({ id: shopProductOptionId });
        }}
      >
        Delete option
      </Button>
    </>
  );
}
