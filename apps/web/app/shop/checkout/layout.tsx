"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { CartItemsTable } from "../../_components/CartItemsTable";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  const cart = useQuery(api.carts.findBySessionedUser);
  const cartIsLoading = cart === undefined;

  if (cartIsLoading) return <LoadingScreen />;
  return (
    <div className="w-full p-8">
      <Text className="text-2xl font-bold">Checkout</Text>
      <hr className="border-dashed my-4" />
      <div className="flex flex-col md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <Text className="font-soleil font-black pb-4">YOUR CART</Text>
          {cart?.items.length ? (
            <>
              <CartItemsTable cartItems={cart.items} />
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
        <div className="w-full md:w-1/2">{children}</div>
      </div>
    </div>
  );
}
