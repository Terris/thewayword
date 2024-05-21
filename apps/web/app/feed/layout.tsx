"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { LayoutGrid, MapPinned } from "lucide-react";
import { cn } from "@repo/utils";
import { useCallback } from "react";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const layout = searchParams.get("layout");

  function handleValueChange(value: string) {
    router.push(`${value}?${createQueryString("layout", layout ?? "grid")}`);
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="w-full p-8">
      <div className="pb-4 flex gap-2">
        <Select
          onValueChange={(v) => {
            handleValueChange(v);
          }}
          value={pathname}
          defaultValue={pathname}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="/feed">Following</SelectItem>
            <SelectItem value="/feed/all">Everyone</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className={cn((!layout || layout === "grid") && "bg-accent")}
          onClick={() => {
            router.push(`${pathname}?${createQueryString("layout", "grid")}`);
          }}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className={cn(layout === "map" && "bg-accent")}
          onClick={() => {
            router.push(`${pathname}?${createQueryString("layout", "map")}`);
          }}
        >
          <MapPinned className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}
