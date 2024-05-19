"use client";

import { type Id, api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { OrderItemsTable } from "../../../_components/OrderItemsTable";

export default function AdminProductsPage() {
  const { id } = useParams();
  const order = useQuery(api.orders.findByIdAsAdmin, {
    id: id as Id<"orders">,
  });

  const isLoading = order === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8">
      <Text className="font-bold text-xl">Admin Order </Text>
      <Text className="text-gray-400 font-soleil pb-4"> #{order?._id}</Text>
      <hr className="border-dashed mb-4" />
      <div className="flex flex-col md:flex-row gap-16">
        <div>
          <Text className="font-bold pb-4">Order Items</Text>
          {order?.items ? <OrderItemsTable orderItems={order.items} /> : null}
        </div>
        <div>
          <Text className="font-bold pb-4">Payments</Text>
          {order?.payments
            ? order.payments.map((payment) => (
                <div key={payment._id} className="border-b pb-4 mb-4">
                  <Text className="font-soleil pb-2 truncate">
                    <span className="text-gray-400 pb-2">ID: </span>{" "}
                    {payment._id}
                  </Text>
                  <Text>
                    <span className="text-gray-400 pb-2">
                      Stripe Payment Intent ID:{" "}
                    </span>
                    {payment.stripePaymentIntentId}
                  </Text>
                  <Text>
                    <span className="text-gray-400 pb-2">Amount: </span> $
                    {payment.amountInCents / 100}
                  </Text>
                  <Text>
                    <span className="text-gray-400 pb-2">Status: </span>
                    {payment.status}
                  </Text>
                </div>
              ))
            : null}
        </div>
        <div>
          <Text className="font-bold pb-4">Shipping</Text>
          <Text>{order?.shippingAddress.addressLine1}</Text>
          <Text>{order?.shippingAddress.addressLine2}</Text>
          <Text>
            {order?.shippingAddress.city}, {order?.shippingAddress.state}{" "}
            {order?.shippingAddress.zip}
          </Text>
        </div>
        <div>
          <Text className="font-bold pb-4">Status</Text>
          <Text>{order?.status}</Text>
        </div>
      </div>
    </div>
  );
}
