"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// eslint-disable-next-line -- fix
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const defaultZoom = 10;
const featureZoom = 14;

export function AdventureLogMap({
  defaultLongitude,
  defaultLatitude,
  initialLongitude,
  initialLatitude,
  featureLongitude,
  featureLatitude,
  moveable,
}: {
  defaultLongitude: number;
  defaultLatitude: number;
  initialLongitude?: number;
  initialLatitude?: number;
  featureLongitude?: number;
  featureLatitude?: number;
  moveable?: boolean;
}) {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [lng, setLng] = useState<number>(defaultLongitude);
  const [lat, setLat] = useState<number>(defaultLatitude);
  const [zoom, setZoom] = useState<number>(defaultZoom);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current ?? "",
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [lng, lat],
      zoom,
      interactive: moveable,
    });

    map.current.on("move", () => {
      setLng(Number(map.current?.getCenter().lng.toFixed(4)));
      setLat(Number(map.current?.getCenter().lat.toFixed(4)));
      setZoom(Number(map.current?.getZoom().toFixed(2)));
    });

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, []);

  // once geo is loaded, update the map
  useEffect(() => {
    if (!map.current || featureLongitude || featureLatitude) return;
    if (initialLongitude && initialLatitude) {
      map.current.easeTo({
        center: [initialLongitude, initialLatitude],
        zoom,
      });
    }
  }, [
    initialLongitude,
    initialLatitude,
    featureLatitude,
    featureLongitude,
    zoom,
  ]);

  useEffect(() => {
    if (!map.current) return;
    if (featureLongitude && featureLatitude) {
      marker.current?.remove();
      marker.current = new mapboxgl.Marker().setLngLat([
        featureLongitude,
        featureLatitude,
      ]);
      marker.current.addTo(map.current);
      map.current.easeTo({
        center: [featureLongitude, featureLatitude],
        zoom: featureZoom,
        duration: 2000,
      });
    }
    return () => {
      marker.current?.remove();
    };
  }, [featureLongitude, featureLatitude]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
        className="rounded"
      />
    </div>
  );
}
