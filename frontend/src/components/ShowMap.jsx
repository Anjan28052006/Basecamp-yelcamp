import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default function ShowMap({ campground, apiKey }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!apiKey || !campground?.geometry?.coordinates || mapRef.current) return;

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: containerRef.current,
      style: maptilersdk.MapStyle.OUTDOOR,
      center: campground.geometry.coordinates,
      zoom: 9,
      navigationControl: false,
      geolocateControl: false,
    });
    mapRef.current = map;

    new maptilersdk.Marker({ color: '#B75B39' })
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
        new maptilersdk.Popup({ offset: 25 }).setHTML(
          `<strong>${campground.titel}</strong><br/>${campground.location}`
        )
      )
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey, campground]);

  return <div ref={containerRef} className="map-box" />;
}
