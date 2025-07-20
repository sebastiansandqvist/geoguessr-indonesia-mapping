// const kabupatenToProvince = allKabupaten.reduce<Record<string, string>>((acc, item) => {
//   if (item.type !== 'Kabupaten') return acc;
//   acc[item.regency] = provinces[item.province_id] || 'Unknown';
//   return acc;
// }, {});

// export function generatePoints(targetCount: number) {
//   const bounds = turf.bbox(gjPerimeter);
//   console.log({ bounds });
//   const area = (bounds[2] - bounds[0]) * (bounds[3] - bounds[1]);
//   console.log({ area });
//   const cellSide = Math.sqrt((area / targetCount) * 2);
//   // console.log({ cellSide });
//   const grid = turf.pointGrid(bounds, cellSide, { units: 'degrees' });
//   // console.log({ grid });
//   const points = turf.pointsWithinPolygon(grid, gjPerimeter);
//   // console.log(points.features.length);
//   const pointsWithKabupaten = {
//     type: 'FeatureCollection' as const,
//     features: points.features.map((point) => {
//       // Find which Kabupaten contains this point
//       let kabupatenName = 'Unknown';
//       let provinceName = 'Unknown';

//       // Check each Kabupaten to see if it contains the point
//       for (const kabupaten of gjKabupaten.features) {
//         if (kabupaten.geometry.type === 'Polygon' || kabupaten.geometry.type === 'MultiPolygon') {
//           if (turf.booleanPointInPolygon(point as any, kabupaten)) {
//             kabupatenName = kabupaten.properties?.shapeName || 'Unknown';
//             break; // Found the Kabupaten, no need to check others
//           }
//         }
//       }

//       for (const province of gjProvinces.features) {
//         if (province.geometry.type === 'Polygon' || province.geometry.type === 'MultiPolygon') {
//           if (turf.booleanPointInPolygon(point as any, province)) {
//             provinceName = province.properties?.shapeName || 'Unknown';
//             break; // Found the Province, no need to check others
//           }
//         }
//       }

//       // Add Kabupaten and province name to point properties
//       return {
//         ...point,
//         properties: {
//           ...point.properties,
//           kabupaten: kabupatenName,
//           province: provinceName,
//         },
//       };
//     }),
//   };

//   // console.log(pointsWithKabupaten);
//   return pointsWithKabupaten;
// }

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
