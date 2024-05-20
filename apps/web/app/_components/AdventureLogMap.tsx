"use client";

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState } from "react";

interface AdventureLogMapProps {
  adventureLogId: string;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  moveable?: boolean;
  markerTitle?: string;
}

export const DEFAULT_MAP_COORDS = {
  lng: -105.6836389,
  lat: 40.3427932,
};

export const DEFAULT_MAP_ZOOM = 10;

export function AdventureLogMap({
  adventureLogId,
  latitude,
  longitude,
  zoom,
  moveable,
  markerTitle,
}: AdventureLogMapProps) {
  return (
    <div className="w-full h-full">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          mapId={adventureLogId}
          defaultZoom={DEFAULT_MAP_ZOOM}
          zoom={zoom}
          center={
            latitude && longitude
              ? { lat: latitude, lng: longitude }
              : undefined
          }
          defaultCenter={DEFAULT_MAP_COORDS}
          disableDefaultUI
          gestureHandling={moveable ? "greedy" : "none"}
          reuseMaps={false}
          mapTypeId="terrain"
        >
          {latitude && longitude ? (
            <MarkerWithInfowindow
              latitude={latitude}
              longitude={longitude}
              markerTitle={markerTitle ?? undefined}
            />
          ) : null}
        </Map>
      </APIProvider>
    </div>
  );
}

interface MarkerWithInfowindowProps {
  latitude: number;
  longitude: number;
  moveable?: boolean;
  markerTitle?: string;
  // markerInfoText?: string;
  // markerInfoLink?: string;
}

function MarkerWithInfowindow({
  latitude,
  longitude,
  markerTitle,
  // markerInfoText,
  // markerInfoLink,
}: MarkerWithInfowindowProps) {
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => {
          setInfowindowOpen(true);
        }}
        position={{ lat: latitude, lng: longitude }}
        title={markerTitle ?? undefined}
      >
        <Pin background="#f3cf1c" borderColor="#368163" glyphColor="#368163" />
      </AdvancedMarker>
      {infowindowOpen ? (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => {
            setInfowindowOpen(false);
          }}
        >
          {markerTitle}
        </InfoWindow>
      ) : null}
    </>
  );
}
