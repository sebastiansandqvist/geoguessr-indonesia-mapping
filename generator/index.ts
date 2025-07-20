import { drizzle } from 'drizzle-orm/bun-sqlite';
import { pointsTable } from './schema';
import { generatePoints } from '../';
const db = drizzle('./db.sqlite');

console.log('generating 1mil');
const points = generatePoints(1_000_000); // generates 96,676 points that fall within bounds
console.log(points.features.length);
console.log(points.features[0]);

let i = 0;
for (const point of points.features) {
  const longitude = typeof point.geometry.coordinates[0] === 'number' ? point.geometry.coordinates[0] : 0;
  const latitude = typeof point.geometry.coordinates[1] === 'number' ? point.geometry.coordinates[1] : 0;
  const p: typeof pointsTable.$inferInsert = {
    kabupaten: point.properties.kabupaten,
    province: point.properties.province,
    latitude,
    longitude,
  };
  await db.insert(pointsTable).values(p);
  i++;
  if (i % 10 === 0) {
    console.log(i);
  }
}
