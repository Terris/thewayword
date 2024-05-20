import { type FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Loader } from "@repo/ui";

export function CheckoutPaymentForm() {
  const { id } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getPaymentIntent() {
      if (!stripe) return;

      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) return;

      const { paymentIntent } =
        await stripe.retrievePaymentIntent(clientSecret);
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    }
    void getPaymentIntent();
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/me/orders/${
          id as string
        }`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="mt-4 w-full"
      >
        {isLoading ? <Loader /> : "Pay now"}
      </Button>
      {message ? <div id="payment-message">{message}</div> : null}
    </form>
  );
}
