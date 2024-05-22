"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Field, Form, Formik, type FieldProps } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "convex/react";
import { api } from "@repo/convex";
import {
  Button,
  Input,
  Label,
  LoadingScreen,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { STATES } from "@repo/utils";
import { EditableCartItemsTable } from "../_components/EditableCartItemsTable";

export default function CheckoutPage() {
  const cart = useQuery(api.carts.findBySessionedUser);
  const cartIsLoading = cart === undefined;

  if (cartIsLoading) return <LoadingScreen />;
  return (
    <div className="w-full p-8 container">
      <Text className="text-2xl font-bold">Checkout</Text>
      <hr className="border-dashed my-4" />
      <div className="flex flex-col md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <Text className="font-bold pb-4">YOUR CART</Text>
          {cart?.items.length ? (
            <>
              <EditableCartItemsTable cartItems={cart.items} />
              <hr />
              <div className="flex justify-end gap-4 items-center p-4">
                <Text>Subtotal</Text>
                <Text className="font-bold">
                  $
                  {cart.items.reduce(
                    (acc, current) =>
                      acc + (current.product?.priceInCents ?? 0),
                    0
                  ) / 100}
                </Text>
              </div>
            </>
          ) : (
            <Text className="text-center pt-8">
              Ohp, there&rsquo;s nothing in your cart.{" "}
              <Link href="/shop" className="underline hover:opacity-80">
                Go back to the shop
              </Link>{" "}
              to add an item.
            </Text>
          )}
        </div>
        <div className="w-full md:w-1/2">
          {cart?.items.length ? <CheckoutShippingForm /> : null}
        </div>
      </div>
    </div>
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
      router.push(`/checkout/${newOrderId}`);
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
          <Text className="font-bold pb-4">SHIPPING</Text>
          <Field name="addressLine1">
            {({ field, meta }: FieldProps) => (
              <div>
                <Label htmlFor={field.name}>Adress line 1</Label>
                <Input className="w-full" {...field} />
                {meta.touched && meta.error ? (
                  <Text className="text-sm text-destructive">{meta.error}</Text>
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
                  <Text className="text-sm text-destructive">{meta.error}</Text>
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
                {({ field, meta, form }: FieldProps) => (
                  <div>
                    <Label htmlFor={field.name}>State</Label>
                    <Select
                      onValueChange={(val) => {
                        void form.setFieldValue(field.name, val);
                      }}
                    >
                      <SelectTrigger className="capitalize w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state.name} value={state.name}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            Next step
          </Button>
        </Form>
      )}
    </Formik>
  );
}
