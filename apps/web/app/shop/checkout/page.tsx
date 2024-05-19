"use client";

import { useRouter } from "next/navigation";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Label, Text } from "@repo/ui";
import { api } from "@repo/convex";
import { useMutation } from "convex/react";

export default function CheckoutPage() {
  return (
    <>
      <Text className="font-soleil font-black pb-4">SHIPPING</Text>{" "}
      <CheckoutShippingForm />
    </>
  );
}

const validationSchema = Yup.object().shape({
  addressLine1: Yup.string().required("Address line 1 is required"),
  addressLine2: Yup.string(),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  zip: Yup.string().required("Zip is required"),
});

interface CheckoutShippingFormValues {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

function CheckoutShippingForm() {
  const { toast } = useToast();
  const router = useRouter();

  const createOrderWithShipping = useMutation(
    api.orders.createOrderWithCartIdAndShippingAddress
  );

  async function onSubmit(values: CheckoutShippingFormValues) {
    try {
      const newOrderId = await createOrderWithShipping({
        shippingAddress: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zip: values.zip,
        },
      });
      router.push(`/shop/checkout/${newOrderId}`);
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
    <div className="w-full">
      <Formik<CheckoutShippingFormValues>
        initialValues={{
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          zip: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form className=" flex flex-col gap-4">
            <Field name="addressLine1">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Adress line 1</Label>
                  <Input className="w-full" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
                  ) : null}
                </div>
              )}
            </Field>
            <Field name="addressLine2">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Adress line 2</Label>
                  <Input className="w-full" {...field} />
                  {meta.touched && meta.error ? (
                    <Text className="text-sm text-destructive">
                      {meta.error}
                    </Text>
                  ) : null}
                </div>
              )}
            </Field>
            <div className="flex flex-row gap-4">
              <div className="w-2/3">
                <Field name="city">
                  {({ field, meta }: FieldProps) => (
                    <div>
                      <Label htmlFor={field.name}>City</Label>
                      <Input className="w-full" {...field} />
                      {meta.touched && meta.error ? (
                        <Text className="text-sm text-destructive">
                          {meta.error}
                        </Text>
                      ) : null}
                    </div>
                  )}
                </Field>
              </div>
              <div className="w-1/3">
                <Field name="state">
                  {({ field, meta }: FieldProps) => (
                    <div>
                      <Label htmlFor={field.name}>State</Label>
                      <Input className="w-full" {...field} />
                      {meta.touched && meta.error ? (
                        <Text className="text-sm text-destructive">
                          {meta.error}
                        </Text>
                      ) : null}
                    </div>
                  )}
                </Field>
              </div>
            </div>
            <Field name="zip">
              {({ field, meta }: FieldProps) => (
                <div>
                  <Label htmlFor={field.name}>Zipcode</Label>
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
              Next step
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
