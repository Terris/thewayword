"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { useAction, useQuery } from "convex/react";
import { Link } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { LoadingBox, LoadingScreen, Text } from "@repo/ui";
import { OrderItemsTable } from "../../_components/OrderItemsTable";
import { CheckoutPaymentForm } from "./CheckoutPaymentForm";

export default function CheckoutPaymentPage() {
  const { id } = useParams();

  const order = useQuery(api.orders.findByIdAsOwner, {
    id: id as Id<"orders">,
  });

  const orderIsLoading = order === undefined;

  const createPaymentIntent = useAction(api.paymentActions.createPaymentIntent);
  const [clientSecret, setClientSecret] = useState("");
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    async function handleCreatePaymentIntent() {
      const paymentIntent = await createPaymentIntent({
        orderId: id as Id<"orders">,
      });
      if (!paymentIntent.clientSecret)
        throw new Error("Client secret not found");
      setClientSecret(paymentIntent.clientSecret);
      setTaxAmount(paymentIntent.taxAmount);
      setTotalAmount(paymentIntent.totalAmount);
    }
    void handleCreatePaymentIntent();
    // eslint-disable-next-line -- react-hooks/exhaustive-deps
  }, []);

  if (orderIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 container">
      <Text className="text-2xl font-bold">Checkout</Text>
      <hr className="border-dashed my-4" />
      <div className="flex flex-col md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <Text className="font-soleil font-black pb-4">YOUR CART</Text>
          {order?.items.length ? (
            <>
              <OrderItemsTable orderItems={order.items} />
              <hr />
              <div className="flex justify-end gap-4 items-center p-4 pb-0">
                <Text>Subtotal</Text>
                <Text className="w-[100px] text-right">
                  $
                  {order.items.reduce(
                    (acc, current) =>
                      acc + (current.product?.priceInCents ?? 0),
                    0
                  ) / 100}
                </Text>
              </div>
              {taxAmount ? (
                <div className="flex justify-end gap-4 items-center p-4">
                  <Text>Taxes</Text>
                  <Text className="w-[100px] text-right">
                    ${taxAmount / 100}
                  </Text>
                </div>
              ) : null}
              {totalAmount ? (
                <div className="flex justify-end gap-4 items-center p-4">
                  <Text>Total</Text>
                  <Text className="font-bold w-[100px] text-right">
                    ${totalAmount / 100}
                  </Text>
                </div>
              ) : null}
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
          <Text className="font-soleil font-black pb-4">PAYMENT</Text>
          {clientSecret ? (
            <PayStep clientSecret={clientSecret} />
          ) : (
            <LoadingBox />
          )}
        </div>
      </div>
    </div>
  );
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function PayStep({ clientSecret }: { clientSecret: string }) {
  const options: StripeElementsOptions = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutPaymentForm />
    </Elements>
  );
}
