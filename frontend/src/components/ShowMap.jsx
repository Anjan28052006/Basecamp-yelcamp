import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default function ShowMap({ campground, apiKey }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!apiKey || !campground?.geometry?.coordinates || mapRef.current || !containerRef.current) return;

    maptilersdk.config.apiKey = apiKey;

    const map = new maptilersdk.Map({
      container: containerRef.current,
      style: maptilersdk.MapStyle.OUTDOOR,
      center: campground.geometry.coordinates,
      zoom: 9,
      navigationControl: true,
      geolocateControl: false,
    });
    mapRef.current = map;

    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
    if (ro && containerRef.current) {
      ro.observe(containerRef.current);
    }

    new maptilersdk.Marker({ color: '#B75B39' })
      .setLngLat(campground.geometry.coordinates)
      .setPopup(
        new maptilersdk.Popup({ offset: 25, maxWidth: '280px' }).setHTML(
          `<strong>${campground.titel}</strong><br/>${campground.location}`
        )
      )
      .addTo(map);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey, campground]);

  return <div ref={containerRef} className="map-box" role="region" aria-label="Campground location map" tabIndex={0} />;
}
