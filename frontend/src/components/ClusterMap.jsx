import { useEffect, useRef } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default function ClusterMap({ campgrounds, apiKey }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!apiKey || mapRef.current || !containerRef.current) return;

    maptilersdk.config.apiKey = apiKey;

    const geojson = {
      type: 'FeatureCollection',
      features: campgrounds
        .filter(c => c.geometry?.coordinates)
        .map(c => ({
          type: 'Feature',
          geometry: c.geometry,
          properties: {
            popUpMarkup: `<strong>${c.titel}</strong><br/>${(c.description || '').slice(0, 40)}...`,
          },
        })),
    };

    const map = new maptilersdk.Map({
      container: containerRef.current,
      style: maptilersdk.MapStyle.OUTDOOR,
      center: [-103.6, 40.7],
      zoom: 3,
      navigationControl: true,
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

    map.on('load', () => {
      map.addSource('campgrounds', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#C99A3E', 10, '#B75B39', 30, '#9A472A'],
          'circle-radius': ['step', ['get', 'point_count'], 16, 10, 22, 30, 28],
        },
      });

      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'campgrounds',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: { 'text-color': '#FBF6EA' },
      });

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'campgrounds',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2F4A3C',
          'circle-radius': 6,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#fff',
        },
      });

      map.on('click', 'clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        const clusterId = features[0].properties.cluster_id;
        const zoom = await map.getSource('campgrounds').getClusterExpansionZoom(clusterId);
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });

      map.on('click', 'unclustered-point', (e) => {
        const { popUpMarkup } = e.features[0].properties;
        const coordinates = e.features[0].geometry.coordinates.slice();
        new maptilersdk.Popup({ maxWidth: '280px' }).setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
      });

      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, [apiKey, campgrounds]);

  return <div ref={containerRef} className="cluster-map-box" role="region" aria-label="Campgrounds cluster map" tabIndex={0} />;
}
