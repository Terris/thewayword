import Link from "next/link";
import { useMutation } from "convex/react";
import { Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Doc, api, type Id } from "@repo/convex";
import { Button, Text } from "@repo/ui";
import { DataTable } from "./DataTable";

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
      return (
        <Text>
          <Link
            href={`/shop/products/${row.original.product?._id}`}
            className="hover:text-amber-400"
          >
            {row.original.product?.name}
          </Link>
        </Text>
      );
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

export function EditableCartItemsTable({
  cartItems,
}: {
  cartItems: CartItemRow[];
}) {
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
