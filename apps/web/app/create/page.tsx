"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useSearchBoxCore } from "@mapbox/search-js-react";
import type { SearchBoxSuggestion } from "@mapbox/search-js-core";
import type { SearchBoxFeatureProperties } from "@mapbox/search-js-core/dist/searchbox/types";
import { api } from "@repo/convex";
import { useDebounce, useGeoLocation } from "@repo/hooks";
import { Text, Input, Button } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useRouter } from "next/navigation";

const searchToken = "log-an-adventure";

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { geo } = useGeoLocation();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<SearchBoxFeatureProperties | null>(null);

  const createLogWithLocation = useMutation(
    api.adventureLogs.createWithLocation
  );

  const searchBoxCore = useSearchBoxCore({
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "",
    country: "us",
    language: "en",
    proximity: geo?.coords
      ? [geo.coords.longitude, geo.coords.latitude]
      : undefined,
  });

  useEffect(() => {
    async function handleSearch() {
      if (debouncedSearchValue) {
        const response = await searchBoxCore.suggest(debouncedSearchValue, {
          sessionToken: "log-an-adventure",
        });
        setSuggestions(response.suggestions);
        if (suggestions.length > 0) {
          setShowSuggestions(true);
        }
      }
    }
    void handleSearch();
  }, [debouncedSearchValue, searchBoxCore, suggestions.length]);

  async function handleSelectLocation(suggestion: SearchBoxSuggestion) {
    const { features } = await searchBoxCore.retrieve(suggestion, {
      sessionToken: searchToken,
    });
    if (!features[0]) return;
    // eslint-disable-next-line -- This is a bug in the search-js-core types
    setSelectedFeature(features[0].properties);
    setShowSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFeature) return;
    try {
      const newAdventureLogId = await createLogWithLocation({
        location: {
          mapboxId: selectedFeature.mapbox_id,
          type: selectedFeature.feature_type,
          latitude: selectedFeature.coordinates.latitude,
          longitude: selectedFeature.coordinates.longitude,
          name: selectedFeature.name,
          full_address: selectedFeature.full_address,
          poiCategories: selectedFeature.poi_category,
        },
      });
      toast({
        title: "Success",
        description: "Adventure log saved as draft!",
      });
      router.push(`/create/${newAdventureLogId}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full max-w-[600px] p-8 mx-auto">
      <Text className="text-2xl font-black uppercase italic pb-4">
        Log an Adventure
      </Text>
      <Text className="font-soleil pb-4 ">Start by selecting a location</Text>
      <form onSubmit={handleSubmit}>
        {showSuggestions ? (
          <div
            className="fixed top-0 right-0 bottom-0 left-0 z-[0]"
            onClick={() => {
              setShowSuggestions(false);
            }}
            onKeyUp={() => {
              setShowSuggestions(false);
            }}
            role="button"
            tabIndex={0}
          />
        ) : null}
        <div className="relative z-1 pb-4">
          <Input
            placeholder="Search for a place..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
            }}
            sizeY="lg"
          />

          {showSuggestions ? (
            <div className="w-full flex flex-col border rounded">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion.mapbox_id}
                  className="text-left text-sm px-4 py-2 hover:bg-muted"
                  onClick={() => {
                    void handleSelectLocation(suggestion);
                  }}
                >
                  <span className="block w-full font-bold">
                    {suggestion.name}
                  </span>
                  {suggestion.full_address}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {selectedFeature ? (
          <>
            <Text className="font-semibold">{selectedFeature.name}</Text>
            <Text className="pb-4">{selectedFeature.full_address}</Text>
          </>
        ) : null}

        <Button
          type="submit"
          disabled={Boolean(!selectedFeature)}
          className="w-full mt-8"
        >
          Next
        </Button>
      </form>
    </div>
  );
}
