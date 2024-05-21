"use client";

import { Text } from "@repo/ui";
import { AdminOrdersTable } from "./AdminOrdersTable";

export default function AdminProductsPage() {
  return (
    <div className="w-full p-8">
      <div className="w-full flex items-center justify-between pb-4">
        <Text className="font-bold text-xl">
          Admin <span className="font-normal">Orders</span>
        </Text>
      </div>
      <AdminOrdersTable />
    </div>
  );
}
