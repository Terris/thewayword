import { api, type Id } from "@repo/convex";
import { Button, LoadingBox, Text } from "@repo/ui";
import { useMutation, useQuery } from "convex/react";
import { EditShopProductOptionForm } from "./EditShopProductOptionForm";

export function EditableShopProductOptions({
  shopProductId,
}: {
  shopProductId: Id<"shopProducts">;
}) {
  const productOptions = useQuery(
    api.shopProductOptions.findAllByShopProductId,
    {
      shopProductId,
    }
  );
  const isLoading = productOptions === undefined;

  const createProductOption = useMutation(
    api.shopProductOptions.createByShopProductId
  );

  if (isLoading) return <LoadingBox />;

  return (
    <div>
      <Text className="text-md font-bold py-4">Product options</Text>
      {productOptions.map((option) => (
        <div className="mb-2 pb-2 border-b border-dashed" key={option._id}>
          <EditShopProductOptionForm shopProductOptionId={option._id} />
        </div>
      ))}
      <Button
        type="button"
        className="my-4"
        onClick={() => {
          void createProductOption({
            shopProductId,
          });
        }}
      >
        Add an option
      </Button>
    </div>
  );
}
