import { type ReactNode, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { type Doc } from "@repo/convex";
import { Text } from "@repo/ui";
import Link from "next/link";
import Image from "next/image";

const DEFAULT_MAP_COORDS = {
  lat: 36.3111595119711,
  lng: -98.0681235625,
};

interface AdventureLog extends Doc<"adventureLogs"> {
  user: Pick<Doc<"users">, "avatarUrl" | "name">;
}

interface FeedMapProps {
  adventureLogs: AdventureLog[];
}

export function FeedMap({ adventureLogs }: FeedMapProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        mapId="adventure-log-feed-map"
        defaultZoom={4}
        defaultCenter={DEFAULT_MAP_COORDS}
        gestureHandling="greedy"
        reuseMaps={false}
        mapTypeId="terrain"
        className="w-full h-full rounded"
      >
        {adventureLogs.map((adventureLog) => (
          <>
            {adventureLog.location?.latitude &&
            adventureLog.location.longitude ? (
              <MarkerWithInfowindow
                latitude={adventureLog.location.latitude}
                longitude={adventureLog.location.longitude}
                markerTitle={adventureLog.title}
                markerContent={
                  <>
                    <Text className="font-bold pb-1">
                      <Link
                        href={`/adventure-logs/${adventureLog._id}`}
                        className="hover:underline"
                      >
                        {adventureLog.title}
                      </Link>
                    </Text>
                    <Link
                      href={`/user/${adventureLog.userId}/adventure-logs`}
                      className="group flex items-center cursor-pointer"
                    >
                      {adventureLog.user.avatarUrl ? (
                        <Image
                          src={adventureLog.user.avatarUrl}
                          width="20"
                          height="20"
                          alt="User"
                          className="w-5 h-5 rounded-full mr-2"
                        />
                      ) : null}
                      <Text className="text-sm text-center leading-none italic group-hover:underline">
                        {adventureLog.user.name}
                      </Text>
                    </Link>
                  </>
                }
              />
            ) : null}
          </>
        ))}
      </Map>
    </APIProvider>
  );
}

interface MarkerWithInfowindowProps {
  latitude: number;
  longitude: number;
  markerTitle: string;
  markerContent: ReactNode;
}

function MarkerWithInfowindow({
  latitude,
  longitude,
  markerTitle,
  markerContent,
}: MarkerWithInfowindowProps) {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => {
          setInfowindowOpen(true);
        }}
        position={{ lat: latitude, lng: longitude }}
        title={markerTitle}
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
          {markerContent}
        </InfoWindow>
      ) : null}
    </>
  );
}
