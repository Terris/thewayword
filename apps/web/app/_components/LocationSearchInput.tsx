"use client";

import { useEffect, useState } from "react";
import { MapPinned } from "lucide-react";
import type {
  SearchBoxFeatureProperties,
  SearchBoxSuggestion,
} from "@mapbox/search-js-core/dist/searchbox/types";
import { useDebounce, useGeoLocation } from "@repo/hooks";
import { Text, Input, Loader } from "@repo/ui";
import { useMeContext } from "@repo/auth/context";

export interface LocationInputValue {
  mapboxId: string;
  type: string;
  latitude: string;
  longitude: string;
  name: string;
  fullAddress: string;
  poiCategories: string[];
}

type SuggestionResult =
  | {
      attribution: string;
      suggestions: SearchBoxSuggestion[];
    }
  | null
  | undefined;
interface FeatureResult {
  type: string;
  features: {
    type: string;
    geometry: {
      coordinates: [number, number];
      type: "Point";
    };
    properties: SearchBoxFeatureProperties;
  }[];
  attribution: string;
}

export function LocationSearchInput({
  searchToken,
  onChange,
}: {
  searchToken: string;
  onChange: (location: LocationInputValue) => void;
}) {
  const { me } = useMeContext();
  const { geo } = useGeoLocation();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchBoxSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<SearchBoxFeatureProperties | null>(null);

  useEffect(() => {
    async function handleSearch() {
      if (debouncedSearchValue && me) {
        setIsSearching(true);
        const proximityParam = geo?.coords
          ? `&proximity=${geo.coords.longitude},${geo.coords.latitude}`
          : null;
        const query = debouncedSearchValue.split(" ").join("+");
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?` +
            `q=${query}` +
            "&language=en" +
            "&types=country,region,district,postcode,locality,place,neighborhood,address,poi,street" +
            `&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}` +
            `&session_token=${me.id}-${searchToken}` +
            `${proximityParam}`
        );
        const data = (await response.json()) as
          | SuggestionResult
          | null
          | undefined;
        if (data?.suggestions) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        }
        setIsSearching(false);
      }
    }
    void handleSearch();
  }, [debouncedSearchValue, geo?.coords, me, searchToken]);

  async function handleSelectLocation(suggestion: SearchBoxSuggestion) {
    const response = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}` +
        `?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}` +
        `&session_token=${searchToken}`
    );
    const data = (await response.json()) as FeatureResult;
    if (data.features.length === 0) return;

    const newSelectedFeature = data.features[0]?.properties;
    if (!newSelectedFeature) return;

    setSelectedFeature(newSelectedFeature);
    onChange({
      mapboxId: newSelectedFeature.mapbox_id,
      type: newSelectedFeature.feature_type,
      latitude: newSelectedFeature.coordinates.latitude.toString(),
      longitude: newSelectedFeature.coordinates.longitude.toString(),
      name: newSelectedFeature.name,
      fullAddress: newSelectedFeature.full_address,
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
          <div className="z-10 absolute bg-background top-[43px] w-full flex flex-col border rounded">
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
