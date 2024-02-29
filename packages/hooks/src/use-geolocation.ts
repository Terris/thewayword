import { useEffect, useState } from "react";

export const useGeoLocation = (options?: PositionOptions) => {
  const [geo, setGeo] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setGeo(pos);
        setError(null);
      },
      (err) => {
        setError(err);
      },
      options
    );
    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, [error, options]);
  return { geo, error };
};
