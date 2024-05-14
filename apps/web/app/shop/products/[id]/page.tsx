"use client";

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { type Id, api } from "@repo/convex";
import {
  Button,
  Label,
  LoadingScreen,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Text,
} from "@repo/ui";

export default function ShopProductPage() {
  const { id } = useParams();

  const product = useQuery(api.shopProducts.findById, {
    id: id as Id<"shopProducts">,
  });
  const isLoading = product === undefined;

  const addToCart = useMutation(api.carts.addShopProductToCartBySessionedUser);

  if (isLoading) return <LoadingScreen />;
  if (product === null) throw new Error("Could not find product with that ID");

  return (
    <div className="w-full container p-8 flex flex-col md:flex-row">
      <div className="md:w-2/3">
        <Image
          src="/img/products/gold-murder-noodle-hat-front.png"
          alt="product image"
          width={800}
          height={800}
          className="rounded max-w-full"
        />
        <Image
          src="/img/products/gold-murder-noodle-hat-back.png"
          alt="product image"
          width={800}
          height={800}
          className="hidden rounded max-w-full"
        />
      </div>
      <div className="md:w-1/3">
        <Text className="text-2xl font-bold pr-4 pt-8">{product.name}</Text>
        <Text className="text-2xl italic text-gray-500 pb-4">
          ${product.priceInCents / 100}
        </Text>
        <div className="flex gap-4">
          <div>
            <Label>Size</Label>
            <Select
              onValueChange={(v) => console.log(v)}
              // value={pathname}
              // defaultValue={pathname}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="mb-8 mt-6"
            onClick={() =>
              addToCart({
                shopProductId: product._id,
                quantity: 1,
              })
            }
          >
            Add to cart
          </Button>
        </div>

        <Text>{product.description}</Text>
      </div>
    </div>
  );
}
