"use client";

import { Text } from "@repo/ui";
import { AdminOrdersTable } from "./AdminOrdersTable";

export default function AdminProductsPage() {
  return (
    <div className="w-full p-8">
      <div className="w-full flex items-center justify-between">
        <Text className="font-bold text-xl pb-4">Admin Orders</Text>
      </div>
      <AdminOrdersTable />
    </div>
  );
}
