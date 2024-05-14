"use client";

import { PrivatePageWrapper } from "@repo/auth";
import { api } from "@repo/convex";
import { Text } from "@repo/ui";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

export default function ShopPage() {
  const allProducts = useQuery(api.shopProducts.findAllPublished);

  // const isLoading = allProducts === undefined;

  return (
    <PrivatePageWrapper authorizedRoles={["admin"]}>
      <div className="w-full p-8 ">
        <Text className="text-2xl font-bold text-center">
          The Wayword Shop is coming soon!
        </Text>
        <Text className="text-center pb-16">
          ...but here&rsquo;s a preview of what&rsquo;s <i>in store</i>.
        </Text>
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
          {allProducts?.map((product) => (
            <div className="group" key={product._id}>
              <Link href={`/shop/products/${product._id}`}>
                <Image
                  src="/img/products/gold-murder-noodle-hat-front.png"
                  alt="product image"
                  width={800}
                  height={800}
                  className="rounded max-w-full group-hover:hidden"
                />
                <Image
                  src="/img/products/gold-murder-noodle-hat-back.png"
                  alt="product image"
                  width={800}
                  height={800}
                  className="hidden rounded max-w-full group-hover:block"
                />
                <Text className="text-lg font-bold text-center pr-4 pt-8">
                  {product.name}
                </Text>
                <Text className="text-center pr-4 italic text-gray-500">
                  ${product.priceInCents / 100}
                </Text>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PrivatePageWrapper>
  );
}
