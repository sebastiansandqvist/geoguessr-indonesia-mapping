import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import type { Accessor, Setter } from 'solid-js';
import rawProvincesGeojson from '../../data/provinces2.geo.json';
import rawKabupatenGeojson from '../../data/kabupaten.geo.json';
import rawPointsNotCovered from '../../data/points-not-covered.json';
import rawPointsCovered from '../../data/points-covered.json';
import type { BasePoint, CoveredPoint } from './types';

const pointsNotCovered = rawPointsNotCovered as BasePoint[];
const pointsCovered = rawPointsCovered as CoveredPoint[];

const gjProvinces = rawProvincesGeojson as GeoJSON.GeoJSON<any, any>;
const gjKabupaten = rawKabupatenGeojson as GeoJSON.GeoJSON<any, any>;

// const popup = new maplibregl.Popup({
//   closeButton: false,
//   closeOnClick: false,
// });

const provinceLabelPoints = {
  type: 'FeatureCollection' as const,
  features: gjProvinces.features.map((province: any) => {
    const centroid = turf.centroid(province);
    return {
      ...centroid,
      properties: province.properties,
    };
  }),
};

const kabupatenLabelPoints = {
  type: 'FeatureCollection' as const,
  features: gjKabupaten.features.map((kabupaten: any) => {
    const centroid = turf.centroid(kabupaten);
    return {
      ...centroid,
      properties: kabupaten.properties,
    };
  }),
};

export function initializeMap({
  map,
  // setHoveredPoint,
  // mode,
  // selectedSubset,
}: {
  map: maplibregl.Map;
  setHoveredPoint: Setter<CoveredPoint | undefined>;
  mode: Accessor<'copyright'>;
  selectedSubset: Accessor<string | undefined>;
}) {
  map.once('load', () => {
    map.addSource('provinces', {
      type: 'geojson',
      data: gjProvinces,
    });

    // add province borders
    map.addLayer({
      id: 'province-border',
      type: 'line',
      source: 'provinces',
      layout: {},
      paint: {
        'line-color': 'black',
        'line-width': 1,
        'line-opacity': 0.5,
      },
    });

    // add province backgrounds
    map.addLayer({
      id: 'province-background',
      type: 'fill',
      source: 'provinces',
      layout: {},
      paint: {
        'fill-color': '#64748b',
        'fill-opacity': 0.75,
      },
    });

    map.addSource('kabupaten', {
      type: 'geojson',
      data: gjKabupaten,
    });
    map.addLayer({
      id: 'kabupaten',
      type: 'line',
      source: 'kabupaten',
      layout: {},
      paint: {
        'line-color': 'black',
        'line-width': 0.5,
        'line-opacity': 0.25,
      },
    });

    // points
    const uncoveredPoints: GeoJSON.GeoJSON<any, any> = {
      type: 'FeatureCollection',
      features: pointsNotCovered.map(({ id, latitude, longitude, province, kabupaten }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          id,
          province,
          kabupaten,
        },
      })),
    };

    map.addSource('points-uncovered', {
      type: 'geojson',
      data: uncoveredPoints,
    });

    map.addLayer({
      id: 'points-uncovered',
      type: 'circle',
      source: 'points-uncovered',
      paint: {
        'circle-radius': [
          'interpolate',
          ['exponential', 1.5], // base for exponential curve
          ['zoom'],
          4,
          1,
          8,
          3,
        ],
        'circle-stroke-width': 3,
        'circle-stroke-opacity': 0,
        'circle-color': '#64748b',
        'circle-opacity': 0.75,
      },
    });

    const coveredPoints: GeoJSON.GeoJSON<any, any> = {
      type: 'FeatureCollection',
      features: pointsCovered.map((point) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.longitude, point.latitude],
        },
        properties: point,
      })),
    };

    map.addSource('points', {
      type: 'geojson',
      data: coveredPoints,
    });

    map.addLayer({
      id: 'points',
      type: 'circle',
      source: 'points',
      paint: {
        'circle-radius': [
          'interpolate',
          ['exponential', 1.5], // base for exponential curve
          ['zoom'],
          4,
          1,
          8,
          3,
        ],
        'circle-stroke-width': 3,
        'circle-stroke-opacity': 0,
        'circle-color': '#be123c',
        'circle-opacity': 0.75,
      },
    });

    // kabupaten labels
    map.addSource('kabupaten-labels', {
      type: 'geojson',
      data: kabupatenLabelPoints,
    });

    map.addLayer({
      id: 'kabupaten-labels',
      type: 'symbol',
      source: 'kabupaten-labels',
      layout: {
        'text-field': ['get', 'shapeName'],
        'text-padding': 3,
        'text-size': [
          'interpolate',
          ['exponential', 1.5], // base for exponential curve
          ['zoom'],
          4,
          9,
          8,
          12,
        ],
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'symbol-placement': 'point',
        'symbol-avoid-edges': true,
        'text-optional': true,
      },
      paint: {
        'text-color': '#222',
        'text-halo-color': '#fff',
        'text-halo-width': 1,
        'text-opacity': ['step', ['zoom'], 0, 6, 1],
      },
    });

    // Add province labels
    map.addSource('province-labels', {
      type: 'geojson',
      data: provinceLabelPoints,
    });

    map.addLayer({
      id: 'province-labels',
      type: 'symbol',
      source: 'province-labels',
      layout: {
        'text-font': ['Open Sans Semibold'],
        'text-field': ['get', 'shapeName'], // Get the province name from properties
        'text-padding': 4,
        'text-size': 12,
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'symbol-placement': 'point',
        'symbol-avoid-edges': true,
        'text-optional': true,
      },
      paint: {
        'text-color': 'black',
        'text-halo-color': '#fff',
        'text-halo-width': 1,
      },
    });

    map.on('mouseover', 'points', (e) => {
      const feature = e.features?.[0];
      if (feature) {
        return feature.properties as CoveredPoint;
      }
    });

    // map.on('mouseenter', 'points', (e) => {
    //   map.getCanvas().style.cursor = 'pointer';

    //   if (e.features && e.features[0]) {
    //     const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice() as [number, number];
    //     const kabupaten = (e.features[0].properties as any).kabupaten || 'Unknown';
    //     const province = (e.features[0].properties as any).province || 'Unknown';
    //     const copyright = ((e.features[0].properties as any).svDate || 'xxxx').slice(0, 4);

    //     popup
    //       .setLngLat(coordinates)
    //       .setHTML(
    //         `<strong>Kabupaten:</strong> ${kabupaten}<br><strong>Province:</strong> ${province}<br><strong>Copyright:</strong> ${copyright}`,
    //       )
    //       .addTo(map);
    //   }
    // });

    // map.on('mouseleave', 'points', () => {
    //   map.getCanvas().style.cursor = '';
    //   popup.remove();
    // });
  });
}
