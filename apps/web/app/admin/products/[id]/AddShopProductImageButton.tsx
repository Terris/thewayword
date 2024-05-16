"use client";

import { useMutation } from "convex/react";
import { ImagePlusIcon } from "lucide-react";
import { type Id, api } from "@repo/convex";
import { useToast } from "@repo/ui/hooks";
import { UploadFileButton } from "../../../_components/UploadFileButton";

export function AddShopProductImageButton({
  shopProductId,
}: {
  shopProductId: Id<"shopProducts">;
}) {
  const { toast } = useToast();
  const addShopProductImage = useMutation(
    api.shopProductImages.createByShopProductId
  );

  async function handleUploadSuccess(fileIds: Id<"files">[]) {
    if (!fileIds[0]) return;
    try {
      await addShopProductImage({
        shopProductId,
        fileId: fileIds[0],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Something went wrong trying to upload a file. Please try again.",
      });
    }
  }

  return (
    <UploadFileButton onSuccess={handleUploadSuccess}>
      <ImagePlusIcon className="w-4 h-4" /> Add a new product image
    </UploadFileButton>
  );
}
