"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Id, api, type Doc } from "@repo/convex";
import { Text } from "@repo/ui";
import { AdminTable } from "../AdminTable";

interface OrderRow {
  _id: string;
  userId: Id<"users">;
  status: string;
  paymentStatus: string;
  user: Doc<"users">;
}

// userId: v.id("users"),
//     cartId: v.optional(v.id("carts")),
//     stripePaymentIntentId: v.optional(v.string()),
//     shippingAddress: v.object({
//       addressLine1: v.string(),
//       addressLine2: v.optional(v.string()),
//       city: v.string(),
//       state: v.string(),
//       zip: v.string(),
//     }),
//     status: v.union(
//       v.literal("created"),
//       v.literal("processing"),
//       v.literal("succeeded"),
//       v.literal("failed")
//     ),

const columns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <Link href={`/admin/orders/${row.original._id}`} className="">
        {row.original._id}
      </Link>
    ),
  },
  {
    accessorKey: "user.email",
    header: "User Email",
    cell: ({ row }) => {
      return <Text>{row.original.user.email}</Text>;
    },
  },
  {
    accessorKey: "user.name",
    header: "User name",
    cell: ({ row }) => {
      return <Text>{row.original.user.name}</Text>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <Text>{row.original.status}</Text>;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      return <Text>{row.original.paymentStatus}</Text>;
    },
  },
];

export function AdminOrdersTable() {
  const ordersData = useQuery(api.orders.findAllAsAdmin);
  if (!ordersData) return null;
  return <AdminTable columns={columns} data={ordersData} />;
}
