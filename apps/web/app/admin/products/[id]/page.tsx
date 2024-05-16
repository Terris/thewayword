"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { type Id, api } from "@repo/convex";
import { LoadingScreen } from "@repo/ui";
import { EditShopProductForm } from "./EditShopProductForm";
import { EditableShopProductOptions } from "./EditableShopProductOptions";
import { EditableShopProductImages } from "./EditableShopProductImages";
import { AddShopProductImageButton } from "./AddShopProductImageButton";

export default function AdminShopProductPage() {
  const { id } = useParams();

  const product = useQuery(api.shopProducts.findById, {
    id: id as Id<"shopProducts">,
  });
  const isLoading = product === undefined;

  if (isLoading) return <LoadingScreen />;
  if (product === null) throw new Error("Could not find product with that ID");

  return (
    <div className="w-full container p-8 flex flex-col md:flex-row">
      <div className="md:w-2/3">
        <EditableShopProductImages shopProductId={id as Id<"shopProducts">} />
        <div className="text-center">
          <AddShopProductImageButton shopProductId={id as Id<"shopProducts">} />
        </div>
      </div>
      <div className="md:w-1/3">
        <div className="sticky top-0">
          <EditShopProductForm />
          <hr />
          <EditableShopProductOptions
            shopProductId={id as Id<"shopProducts">}
          />
        </div>
      </div>
    </div>
  );
}
