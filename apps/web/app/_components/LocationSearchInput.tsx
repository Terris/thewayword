"use client";

import { useEffect, useRef, useState } from "react";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "@repo/ui";

export interface LocationInputValue {
  latitude: string;
  longitude: string;
  name: string;
  fullAddress: string;
}

export function LocationSearchInput({
  onChange,
}: {
  onChange: (location: LocationInputValue) => void;
}) {
  // eslint-disable-next-line no-undef -- wtf?
  function handleSelectPlace(location: google.maps.places.PlaceResult | null) {
    if (!location) return;
    onChange({
      latitude: location.geometry?.location?.lat().toString() ?? "",
      longitude: location.geometry?.location?.lng().toString() ?? "",
      name: location.name ?? "",
      fullAddress: location.formatted_address ?? "",
    });
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <PlaceAutocompleteInput onPlaceSelect={handleSelectPlace} />
    </APIProvider>
  );
}

function PlaceAutocompleteInput({
  onPlaceSelect,
}: {
  // eslint-disable-next-line no-undef -- wtf?
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    // eslint-disable-next-line no-undef -- wtf?
    useState<google.maps.places.Autocomplete | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    setPlaceAutocomplete(
      new places.Autocomplete(inputRef.current, {
        fields: ["geometry", "name", "formatted_address"],
      })
    );
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return <Input ref={inputRef} />;
}
