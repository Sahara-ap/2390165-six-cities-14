import { useState, useRef, useEffect } from 'react';

import { Map } from 'leaflet';
import L from 'leaflet';

import Loc from '../types/loc';

function useMap(
  mapRef: React.MutableRefObject<HTMLElement | null>,
  cityLocation: Loc | object,
): Map | null {
  const [map, setMap] = useState<Map | null>(null);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isRenderedRef.current && mapRef.current !== null && 'latitude' in cityLocation) {
      const instance = L.map(mapRef.current, {
        center: {
          lat: cityLocation.latitude,
          lng: cityLocation.longitude,
        },
        zoom: cityLocation.zoom
      });

      const layer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
      );

      layer.addTo(instance);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, cityLocation]);
  return map;
}

export default useMap;

