import { Button, Input } from "@repo/ui";
import { Search } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [queryTerm, setQueryTerm] = useState<string>(query ?? "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function handleSumbit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/search?${createQueryString("query", queryTerm)}`);
  }

  return (
    <form className="relative" onSubmit={handleSumbit}>
      <Input
        placeholder="Search..."
        value={queryTerm}
        onChange={(e) => {
          setQueryTerm(e.currentTarget.value);
        }}
        sizeY="sm"
        className="pr-8"
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
      >
        <Search className="w-4 h-4" />
      </Button>
    </form>
  );
}
