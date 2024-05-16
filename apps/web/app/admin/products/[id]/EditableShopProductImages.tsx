"use client";

import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import { api, type Id } from "@repo/convex";
import { Button, LoadingBox } from "@repo/ui";

export function EditableShopProductImages({
  shopProductId,
}: {
  shopProductId: Id<"shopProducts">;
}) {
  const productImages = useQuery(api.shopProductImages.findAllByShopProductId, {
    shopProductId,
  });

  const isLoading = productImages === undefined;

  const deleteShopProductImage = useMutation(api.shopProductImages.deleteById);

  if (isLoading) return <LoadingBox />;

  return productImages?.map((image) => (
    <div
      className="group relative flex items-center justify-center"
      key={image._id}
    >
      <Image
        src={image.file?.url ?? ""}
        alt="product image"
        width={800}
        height={800}
        className="rounded max-w-full"
      />
      <Button
        size="sm"
        onClick={() => {
          void deleteShopProductImage({ id: image._id });
        }}
        className="hidden absolute group-hover:block"
      >
        Delete
      </Button>
    </div>
  ));
}
