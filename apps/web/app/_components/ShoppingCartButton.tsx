import Link from "next/link";
import { useQuery } from "convex/react";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { api } from "@repo/convex";
import {
  Button,
  CountBadge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Text,
} from "@repo/ui";
import { cn } from "@repo/utils";
import { EditableCartItemsTable } from "./EditableCartItemsTable";

export function ShoppingCartButton() {
  const cart = useQuery(api.carts.findBySessionedUser);
  const isLoading = cart === undefined;
  const cartItemCount = cart?.items.length;
  const [cartIsOpen, setCartIsOpen] = useState(false);

  if (isLoading || !cartItemCount) return null;

  return (
    <Dialog
      open={cartIsOpen}
      onOpenChange={(o) => {
        setCartIsOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full flex-shrink-0 ",
            cartItemCount && "bg-muted"
          )}
        >
          <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
          {cartItemCount ? (
            <CountBadge
              count={cartItemCount}
              className="absolute -top-2 -right-2"
            />
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 w-full max-w-[900px]">
        <DialogHeader>
          <DialogTitle className="pb-4">Your cart</DialogTitle>
          <EditableCartItemsTable
            cartItems={cart.items.map((item) => ({
              ...item,
              cartId: cart._id,
            }))}
          />
          <hr />
          <div className="flex justify-end gap-4 items-center p-4">
            <Text>Cart total</Text>
            <Text className="font-bold">
              $
              {cart.items.reduce(
                (acc, current) => acc + (current.product?.priceInCents ?? 0),
                0
              ) / 100}
            </Text>
            <Link href="/checkout">
              <Button
                onClick={() => {
                  setCartIsOpen(false);
                }}
              >
                Checkout
              </Button>
            </Link>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
