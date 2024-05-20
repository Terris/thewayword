"use client";

import { api } from "@repo/convex";
import { LoadingScreen, Text } from "@repo/ui";
import { useQuery } from "convex/react";
import Link from "next/link";
import { ShopProductCoverImage } from "./ShopProductCoverImage";

export default function ShopPage() {
  const allProducts = useQuery(api.shopProducts.findAllPublished);

  const isLoading = allProducts === undefined;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full p-8 ">
      {allProducts?.length ? (
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
          {allProducts.map((product) => (
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
      ) : (
        <Text className="text-center py-16">
          Ohp, sorry! There are no products available at this time.
        </Text>
      )}
    </div>
  );
}
