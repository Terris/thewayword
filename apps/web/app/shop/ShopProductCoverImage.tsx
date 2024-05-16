import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { useQuery } from "convex/react";
import Image from "next/image";

export function ShopProductCoverImage({
  shopProductId,
}: {
  shopProductId: Id<"shopProducts">;
}) {
  const productCoverImage = useQuery(
    api.shopProductImages.findFirstByShopProductId,
    {
      shopProductId,
    }
  );
  const isLoading = productCoverImage === undefined;

  if (isLoading) return <LoadingBox />;
  return (
    <Image
      src={productCoverImage?.file?.url ?? ""}
      alt="product image"
      width={800}
      height={800}
      className="rounded max-w-full group-hover:opacity-90 transition-opacity"
    />
  );
}
