"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function handleValueChange(value: string) {
    router.push(value);
  }

  return (
    <div className="w-full p-8">
      <div className="pb-4">
        <Select
          onValueChange={(v) => {
            handleValueChange(v);
          }}
          defaultValue={pathname}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="/feed">Following</SelectItem>
            <SelectItem value="/feed/all">Everyone</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {children}
    </div>
  );
}
