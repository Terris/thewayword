"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { type ColumnDef } from "@tanstack/react-table";
import { api } from "@repo/convex";
import {
  Text,
  CopyToClipboardButton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@repo/ui";
import { AdminTable, AdminTableBooleanCell } from "../AdminTable";

interface ShopProductRow {
  _id: string;
  name: string;
  priceInCents: number;
  published: boolean;
}

const columns: ColumnDef<ShopProductRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <Link href={`/admin/shopProducts/${row.original._id}`}>
          {row.original.name}
        </Link>
      );
    },
  },
  {
    accessorKey: "priceInCents",
    header: "Price in cents",
  },
  {
    accessorKey: "published",
    header: "Published?",
    cell: ({ row }) => {
      const isPublished: boolean = row.getValue("published");
      return (
        <Tooltip>
          <TooltipTrigger>
            <AdminTableBooleanCell value={isPublished} />
          </TooltipTrigger>
          <TooltipContent>
            {isPublished ? "Published" : "Not published"}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => (
      <div className="max-w-[100px] flex items-center justify-between">
        <Text className="truncate pr-2">{row.original._id}</Text>
        <Tooltip>
          <TooltipTrigger>
            <CopyToClipboardButton
              textToCopy={row.original._id}
              variant="ghost"
              size="sm"
            />
          </TooltipTrigger>
          <TooltipContent>Copy ID to clipboard</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];

export function ShopProductsTable() {
  const shopProductsData = useQuery(api.shopProducts.findAllAsAdmin);
  if (!shopProductsData) return null;
  return <AdminTable columns={columns} data={shopProductsData} />;
}
