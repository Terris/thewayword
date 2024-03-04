"use client";

import { useEffect, useState } from "react";
import { useSearchBoxCore } from "@mapbox/search-js-react";
import type {
  SearchBoxFeatureProperties,
  SearchBoxSuggestion,
} from "@mapbox/search-js-core/dist/searchbox/types";
import { MapPinned } from "lucide-react";
import { useDebounce, useGeoLocation } from "@repo/hooks";
import { Text, Input, Loader } from "@repo/ui";

export interface LocationInputValue {
  mapboxId: string;
  type: string;
  latitude: string;
  longitude: string;
  name: string;
  fullAddress: string;
  poiCategories: string[];
}

export function LocationSearchInput({
  searchToken,
  onChange,
}: {
  searchToken: string;
  onChange: (location: LocationInputValue) => void;
}) {
  const { geo } = useGeoLocation();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<SearchBoxFeatureProperties | null>(null);

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
        setIsSearching(true);
        const response = await searchBoxCore.suggest(debouncedSearchValue, {
          sessionToken: "log-an-adventure",
        });
        setSuggestions(response.suggestions);
        if (suggestions.length > 0) {
          setShowSuggestions(true);
        }
        setIsSearching(false);
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
    const newSelectedFeature = features[0].properties;
    // eslint-disable-next-line -- This is a bug in the search-js-core types
    setSelectedFeature(newSelectedFeature);
    onChange({
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      mapboxId: newSelectedFeature.mapbox_id,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      type: newSelectedFeature.feature_type,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      latitude: newSelectedFeature.coordinates.latitude.toString(),
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      longitude: newSelectedFeature.coordinates.longitude.toString(),
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      name: newSelectedFeature.name,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      fullAddress: newSelectedFeature.full_address,
      // eslint-disable-next-line -- This is a bug in the search-js-core types
      poiCategories: newSelectedFeature.poi_category,
    });
    setShowSuggestions(false);
  }

  return (
    <>
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
        <div className="relative flex flex-row items-center">
          <Input
            placeholder="Rocky Mountain National Park"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.currentTarget.value);
            }}
            sizeY="lg"
            className="placeholder:italic "
          />
          {isSearching ? <Loader className="absolute right-4" /> : null}
        </div>

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
        <div className="flex flex-row items-center">
          <MapPinned className="w-6 h-6 mx-4" />
          <div>
            <Text className="font-semibold">{selectedFeature.name}</Text>
            <Text>{selectedFeature.full_address}</Text>
          </div>
        </div>
      ) : null}
    </>
  );
}
