import { type Id, api } from "@repo/convex";
import { LoadingBox } from "@repo/ui";
import { cn } from "@repo/utils";
import { useQuery } from "convex/react";
import Image from "next/image";

export function ShopProductCoverImage({
  shopProductId,
  className,
}: {
  shopProductId: Id<"shopProducts">;
  className?: string;
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
      className={cn("rounded max-w-full", className)}
    />
  );
}
