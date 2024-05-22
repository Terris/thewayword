"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
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
import { useToast } from "@repo/ui/hooks";
import { ShopProductImages } from "./ShopProductImages";

interface ProductOptionSelection {
  name: string;
  value: string;
}

export default function ShopProductPage() {
  const { toast } = useToast();
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState<
    ProductOptionSelection[]
  >([]);

  const product = useQuery(api.shopProducts.findPublishedById, {
    id: id as Id<"shopProducts">,
  });
  const isLoading = product === undefined;

  const addToCart = useMutation(api.carts.addShopProductToCartBySessionedUser);

  const canAddToCart = selectedOptions.length === product?.options.length;

  function handleSelectProductOption(
    optionName: string,
    selectedValue: string
  ) {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option.name !== optionName
    );
    setSelectedOptions([
      ...newSelectedOptions,
      { name: optionName, value: selectedValue },
    ]);
  }

  async function handleAddToCart() {
    if (!canAddToCart) return;
    try {
      await addToCart({
        shopProductId: product._id,
        options: selectedOptions,
      });
      toast({
        title: "Success",
        description: `${product.name} added to cart`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error trying to add item to cart",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="w-full container p-8 flex flex-col md:flex-row">
      <div className="md:w-2/3">
        <ShopProductImages shopProductId={id as Id<"shopProducts">} />
      </div>
      <div className="md:w-1/3">
        <div className="sticky top-1">
          <Text className="text-2xl font-bold tracking-tight pr-4 pt-8">
            {product.name}
          </Text>
          <Text className="text-2xl text-neutral pb-4">
            ${product.priceInCents / 100}
          </Text>
          <div className="flex gap-4">
            {product.options.map((option) => (
              <div key={option._id}>
                <Label>{option.name}</Label>
                <Select
                  onValueChange={(val) => {
                    handleSelectProductOption(option.name, val);
                  }}
                >
                  <SelectTrigger className="w-[120px] capitalize">
                    <SelectValue placeholder={option.name} />
                  </SelectTrigger>
                  <SelectContent>
                    {option.values.map((value) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="capitalize"
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button
              className="mb-8 mt-6"
              onClick={() => handleAddToCart()}
              disabled={!canAddToCart}
            >
              Add to cart
            </Button>
          </div>
          <Text className="whitespace-pre-wrap">{product.description}</Text>
        </div>
      </div>
    </div>
  );
}
