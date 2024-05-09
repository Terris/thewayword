"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { useDebounce } from "@repo/hooks";
import { Button, Input, LoadingBox, Text } from "@repo/ui";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [queryTerm, setQueryTerm] = useState<string>("");
  const debouncedQueryTerm = useDebounce(queryTerm, 500);

  const tagSearchResults = useQuery(
    api.tags.search,
    !debouncedQueryTerm
      ? "skip"
      : {
          queryTerm: debouncedQueryTerm,
        }
  );

  const isLoading =
    Boolean(debouncedQueryTerm) && tagSearchResults === undefined;

  return (
    <div className="w-full p-8">
      <div className="w-full flex flex-row mx-auto p-4 mb-8 rounded shadow-md md:w-1/2 ">
        <Input
          placeholder="Search..."
          className="mr-2"
          value={queryTerm}
          onChange={(e) => {
            setQueryTerm(e.currentTarget.value);
          }}
        />
        <Button variant="outline">
          <Search className="w-4 h-4" />
        </Button>
      </div>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <>
          {tagSearchResults?.map((result) => (
            <Text key={result._id} className="capitalize">
              {result.name}
            </Text>
          ))}
        </>
      )}
    </div>
  );
}
