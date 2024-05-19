"use client";

import { type FormEvent, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button, Text } from "@repo/ui";

export function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null | undefined>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    setError(result.error.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error ? <Text>{error}</Text> : null}
      <PaymentElement />
      <Button type="submit" disabled={!stripe}>
        Submit
      </Button>
    </form>
  );
}

export default CheckoutForm;
