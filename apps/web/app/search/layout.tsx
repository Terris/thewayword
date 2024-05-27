"use client";

import { useDebounce } from "@repo/hooks";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [queryTerm, setQueryTerm] = useState<string>(query ?? "");
  const debouncedQueryTerm = useDebounce(queryTerm, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (debouncedQueryTerm) {
      router.push(
        `${pathname}?${createQueryString("query", debouncedQueryTerm)}`
      );
    }
  }, [debouncedQueryTerm]);

  function handleValueChange(value: string) {
    router.push(`${value}?${createQueryString("query", queryTerm)}`);
  }

  return (
    <div className="w-full p-8">
      <form
        className="w-full flex flex-row gap-2 mx-auto p-4 mb-8 rounded shadow-md md:w-1/2"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          placeholder="Search..."
          value={queryTerm}
          onChange={(e) => {
            setQueryTerm(e.currentTarget.value);
          }}
        />
        <Select
          onValueChange={(v) => {
            handleValueChange(v);
          }}
          value={pathname}
          defaultValue={pathname}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="/search">Logs</SelectItem>
            <SelectItem value="/search/tags">Tags</SelectItem>
            <SelectItem value="/search/users">Members</SelectItem>
          </SelectContent>
        </Select>
      </form>
      {children}
    </div>
  );
}
