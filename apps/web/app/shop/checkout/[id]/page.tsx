"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Text } from "@repo/ui";
import { CheckoutForm } from "./CheckoutPaymentForm";

export default function CheckoutPaymentPage() {
  return (
    <>
      <Text className="font-soleil font-black pb-4">PAYMENT</Text>
      <PayStep />
    </>
  );
}

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function PayStep() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret: "{{CLIENT_SECRET}}",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
