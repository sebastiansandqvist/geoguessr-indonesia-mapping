import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import rawPerimeterGeojson from './data/indonesia.geo.json';
import rawProvincesGeojson from './data/provinces2.geo.json';
import rawKabupatenGeojson from './data/kabupaten.geo.json';

// import provincesJson from './data/provinces.json';
// const provinces = provincesJson as Record<number, string>;
// const allKabupaten = kabupatenJson as {
//   regency: string;
//   type: string;
//   province_id: number;
// }[];

const gjPerimeter = rawPerimeterGeojson as GeoJSON.GeoJSON<any, any>;
const gjProvinces = rawProvincesGeojson as GeoJSON.GeoJSON<any, any>;
const gjKabupaten = rawKabupatenGeojson as GeoJSON.GeoJSON<any, any>;

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

// const kabupatenToProvince = allKabupaten.reduce<Record<string, string>>((acc, item) => {
//   if (item.type !== 'Kabupaten') return acc;
//   acc[item.regency] = provinces[item.province_id] || 'Unknown';
//   return acc;
// }, {});

const map = new maplibregl.Map({
  container: 'map', // html map div id
  style: 'https://demotiles.maplibre.org/style.json', // style URL
  center: [117.0, -2.5], // starting position [lng, lat] centered on Indonesia
  zoom: 4, // starting zoom level to show all of Indonesia
});

function generatePoints(targetCount: number) {
  const bounds = turf.bbox(gjPerimeter);
  console.log({ bounds });
  const area = (bounds[2] - bounds[0]) * (bounds[3] - bounds[1]);
  console.log({ area });
  const cellSide = Math.sqrt((area / targetCount) * 2);
  console.log({ cellSide });
  const grid = turf.pointGrid(bounds, cellSide, { units: 'degrees' });
  console.log({ grid });
  const points = turf.pointsWithinPolygon(grid, gjPerimeter);
  console.log(points);
  const pointsWithKabupaten = {
    type: 'FeatureCollection' as const,
    features: points.features.map((point) => {
      // Find which Kabupaten contains this point
      let kabupatenName = 'Unknown';
      let provinceName = 'Unknown';

      // Check each Kabupaten to see if it contains the point
      for (const kabupaten of gjKabupaten.features) {
        if (kabupaten.geometry.type === 'Polygon' || kabupaten.geometry.type === 'MultiPolygon') {
          if (turf.booleanPointInPolygon(point as any, kabupaten)) {
            kabupatenName = kabupaten.properties?.shapeName || 'Unknown';
            break; // Found the Kabupaten, no need to check others
          }
        }
      }

      for (const province of gjProvinces.features) {
        if (province.geometry.type === 'Polygon' || province.geometry.type === 'MultiPolygon') {
          if (turf.booleanPointInPolygon(point as any, province)) {
            provinceName = province.properties?.shapeName || 'Unknown';
            break; // Found the Province, no need to check others
          }
        }
      }

      // Add Kabupaten and province name to point properties
      return {
        ...point,
        properties: {
          ...point.properties,
          kabupaten: kabupatenName,
          province: provinceName,
        },
      };
    }),
  };

  console.log(pointsWithKabupaten);
  return pointsWithKabupaten;
}

// const kabupatenColors = Object.entries(kabupatenToProvince).reduce<Record<string, string>>(
//   (acc, [kabupaten, provinceName]) => {
//     // Find the province ID to get the corresponding color
//     const provinceIndex = Object.entries(provinces).findIndex(([_, name]) => name === provinceName);
//     if (provinceIndex) {
//       acc[kabupaten] = `hsl(${(provinceIndex * 360) / Object.keys(provinces).length}, 70%, 50%)`;
//     }
//     return acc;
//   },
//   {},
// );

const popup = new maplibregl.Popup({
  closeButton: false,
  closeOnClick: false,
});

map.once('load', () => {
  // outline
  // map.addSource('indonesia', {
  //   type: 'geojson',
  //   data: gjPerimeter,
  // });
  // map.addLayer({
  //   id: 'indonesia',
  //   type: 'fill',
  //   source: 'indonesia',
  //   layout: {},
  //   paint: {
  //     'fill-color': '#088',
  //     'fill-opacity': 0.3,
  //   },
  // });
  map.addSource('provinces', {
    type: 'geojson',
    data: gjProvinces,
  });

  // Add province border layer (initially invisible)
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
    // filter: ['==', 'shapeName', ''] // Initially match nothing
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
  const points = generatePoints(100000); // actually creates 9669 points
  map.addSource('points', {
    type: 'geojson',
    data: points,
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

  // Add kabupaten labels
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

  // for (const point of points.features) {
  //   const [lat, lon] = point.geometry.coordinates;
  // }

  map.on('mouseenter', 'kabupaten', (e) => {
    if (e.features && e.features[0]) {
      console.log(e.features);
      map.setFeatureState({ source: 'kabupaten', id: (e.features[0].properties as any).shapeID }, { hover: true });
    }
  });

  map.on('mouseenter', 'points', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    if (e.features && e.features[0]) {
      const coordinates = (e.features[0].geometry as GeoJSON.Point).coordinates.slice();
      const kabupaten = (e.features[0].properties as any).kabupaten || 'Unknown';
      const province = (e.features[0].properties as any).province || 'Unknown';

      popup
        .setLngLat(coordinates as [number, number])
        .setHTML(`<strong>Kabupaten:</strong> ${kabupaten}<br><strong>Province:</strong> ${province}`)
        .addTo(map);
    }
  });

  map.on('mouseleave', 'points', () => {
    map.getCanvas().style.cursor = '';
    popup.remove();
  });
});
