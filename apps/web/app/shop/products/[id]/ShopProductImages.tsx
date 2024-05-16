"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { LoadingBox } from "@repo/ui";

export function ShopProductImages({
  shopProductId,
}: {
  shopProductId: Id<"shopProducts">;
}) {
  const productImages = useQuery(api.shopProductImages.findAllByShopProductId, {
    shopProductId,
  });

  const isLoading = productImages === undefined;

  if (isLoading) return <LoadingBox />;

  return productImages?.map((image) => (
    <Image
      key={image._id}
      src={image.file?.url ?? ""}
      alt="product image"
      width={800}
      height={800}
      className="rounded max-w-full"
    />
  ));
}
