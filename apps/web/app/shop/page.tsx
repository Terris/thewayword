"use client";

import { PrivatePageWrapper } from "@repo/auth";
import { api } from "@repo/convex";
import { Text } from "@repo/ui";
import { useQuery } from "convex/react";
import Link from "next/link";
import { ShopProductCoverImage } from "./ShopProductCoverImage";

export default function ShopPage() {
  const allProducts = useQuery(api.shopProducts.findAllPublished);

  // const isLoading = allProducts === undefined;

  return (
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
                <ShopProductCoverImage shopProductId={product._id} />
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
  );
}
