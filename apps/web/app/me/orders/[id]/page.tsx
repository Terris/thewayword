"use client";

import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { OrderItemsTable } from "../../../_components/OrderItemsTable";

export default function MeOrderPage() {
  const { id } = useParams();
  const order = useQuery(api.orders.findByIdAsOwner, {
    id: id as Id<"orders">,
  });

  const orderIsLoading = order === undefined;

  if (orderIsLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 container">
      <Text className="text-2xl font-bold">Order Details</Text>
      <Text className="text-sm">Order ID: {order?._id}</Text>
      <hr className="border-dashed my-4" />
      <div className="flex flex-col md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <Text className="font-bold pb-4">PURCHASED ITEMS</Text>
          {order?.items ? <OrderItemsTable orderItems={order.items} /> : null}
        </div>
        <div className="w-full md:w-1/2">
          <Text className="font-bold">FULFILLMENT STATUS</Text>
          <Text className="capitalize pb-4">{order?.status}</Text>

          <Text className="font-bold">PAYMENT STATUS</Text>
          <Text className="capitalize pb-4">{order?.paymentStatus}</Text>

          <Text className="font-bold">SHIPPING TO</Text>
          <Text>{order?.shippingAddress.addressLine1}</Text>
          <Text>{order?.shippingAddress.addressLine2}</Text>
          <Text className="pb-4">
            {order?.shippingAddress.city}, {order?.shippingAddress.state}{" "}
            {order?.shippingAddress.zip}
          </Text>
          <Text className="font-bold">TRACKING</Text>
          <Text className="pb-4">
            Tracking information will appear here when available.
          </Text>
        </div>
      </div>
    </div>
  );
}
