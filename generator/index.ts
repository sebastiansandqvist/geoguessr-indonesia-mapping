import { drizzle } from 'drizzle-orm/bun-sqlite';
import { pointsTable } from './schema';
import { generatePoints } from '../';
const db = drizzle('./db.sqlite');

// const points = generatePoints(500000); // 48415 points
// console.log(points.features.length);
// console.log(points.features[0]);

// let i = 0;
// for (const point of points.features) {
//   const longitude = typeof point.geometry.coordinates[0] === 'number' ? point.geometry.coordinates[0] : 0;
//   const latitude = typeof point.geometry.coordinates[1] === 'number' ? point.geometry.coordinates[1] : 0;
//   const p: typeof pointsTable.$inferInsert = {
//     kabupaten: point.properties.kabupaten,
//     province: point.properties.province,
//     latitude,
//     longitude,
//     hasStreetviewCoverage: 0,
//   };
//   await db.insert(pointsTable).values(p);
//   // await appendFile(
//   //   `./generated/${point.properties.province}/${point.properties.kabupaten}.jsonl`,
//   //   JSON.stringify({
//   //     id: i,
//   //     kabupaten: point.properties.kabupaten,
//   //     province: point.properties.province,
//   //     coords: point.geometry.coordinates,
//   //   }),
//   //   {},
//   // );
//   // // await Bun.file(`./generated/${point.properties.province}/${point.properties.kabupaten}`).write(

//   // // );
//   i++;
//   if (i % 10 === 0) {
//     console.log(i);
//   }
// }
