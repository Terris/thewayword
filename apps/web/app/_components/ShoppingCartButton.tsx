import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Doc, api, type Id } from "@repo/convex";
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
import { DataTable } from "./DataTable";

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
          <CartItemsTable
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
            <Link href="/shop/checkout">
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

interface CartItemRow {
  _id: Id<"cartItems">;
  cartId: Id<"carts">;
  product: Doc<"shopProducts"> | null;
  options?: { name: string; value: string }[];
}

const columns: ColumnDef<CartItemRow>[] = [
  {
    accessorKey: "product.name",
    header: "Product",
    cell: ({ row }) => {
      return <Text>{row.original.product?.name}</Text>;
    },
  },
  {
    accessorKey: "options",
    header: "Options",
    cell: ({ row }) => {
      return (
        <Text>
          <Link href={`/shop/products/${row.original.product?._id}`}>
            {row.original.options?.map((option) => (
              <>
                {option.name}: {option.value}{" "}
              </>
            ))}
          </Link>
        </Text>
      );
    },
  },
  {
    accessorKey: "product.priceInCents",
    header: "Price",
    cell: ({ row }) => (
      <Text>${(row.original.product?.priceInCents ?? 0) / 100}</Text>
    ),
  },
  {
    accessorKey: "delete",
    header: "Remove item",
    cell: ({ row }) => (
      <DeleteCartItemButton
        cartId={row.original.cartId}
        cartItemId={row.original._id}
      />
    ),
  },
];

function CartItemsTable({ cartItems }: { cartItems: CartItemRow[] }) {
  return <DataTable columns={columns} data={cartItems} />;
}

function DeleteCartItemButton({
  cartId,
  cartItemId,
}: {
  cartId: Id<"carts">;
  cartItemId: Id<"cartItems">;
}) {
  const deleteCartItem = useMutation(api.carts.removeCartItemById);
  return (
    <Button
      onClick={() => {
        void deleteCartItem({
          cartId,
          cartItemId,
        });
      }}
      variant="ghost"
    >
      <Trash2 className="w-3 h-3" />
    </Button>
  );
}
