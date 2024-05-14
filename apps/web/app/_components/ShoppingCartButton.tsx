import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { ShoppingCart } from "lucide-react";
import {
  Button,
  CountBadge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Text,
} from "@repo/ui";
import { cn } from "@repo/utils";
import { api } from "@repo/convex";

export function ShoppingCartButton() {
  const router = useRouter();
  const cart = useQuery(api.carts.findBySessionedUser);
  const isLoading = cart === undefined;
  const cartItemCount = cart?.items.length;

  if (isLoading || !cartItemCount) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative rounded-full flex-shrink-0 ",
            cartItemCount && "bg-muted"
          )}
        >
          <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
          {cartItemCount ? (
            <CountBadge
              count={cartItemCount}
              className="absolute -top-2 -right-2"
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56 p-2">
        {cart.items.map((item) => (
          <DropdownMenuItem
            key={item.shopProductId}
            onClick={() => {
              router.push(`/shop/products/${item.shopProductId}`);
            }}
          >
            <div className="flex flex-col flex-1">
              <Text className="font-soleil">{item.product?.name}</Text>
              <Text>
                {item.quantity} x ${(item.product?.priceInCents ?? 0) / 100}
              </Text>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
