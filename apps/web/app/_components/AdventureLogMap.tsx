"use client";

import {
  AdvancedMarker,
  APIProvider,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";

interface AdventureLogMapProps {
  adventureLogId: string;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  latitude?: number;
  longitude?: number;
  zoom?: number;
  moveable?: boolean;
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
            <AdvancedMarker
              position={{ lat: latitude, lng: longitude }}
              // title="AdvancedMarker with customized pin."
            >
              <Pin
                background="#22ccff"
                borderColor="#1e89a1"
                glyphColor="#0f677a"
              />
            </AdvancedMarker>
          ) : null}
        </Map>
      </APIProvider>
    </div>
  );
}
