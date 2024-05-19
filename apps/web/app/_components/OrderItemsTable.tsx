import { type ColumnDef } from "@tanstack/react-table";
import { type Doc, type Id } from "@repo/convex";
import { Text } from "@repo/ui";
import { DataTable } from "./DataTable";

interface OrderItemRow {
  _id: Id<"orderItems">;
  orderId: Id<"orders">;
  product: Doc<"shopProducts"> | null;
  options?: { name: string; value: string }[];
}

const columns: ColumnDef<OrderItemRow>[] = [
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
          {row.original.options?.map((option) => (
            <>
              {option.name}: {option.value}{" "}
            </>
          ))}
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
];

export function OrderItemsTable({
  orderItems,
}: {
  orderItems: OrderItemRow[];
}) {
  return <DataTable columns={columns} data={orderItems} />;
}
