import { drizzle } from 'drizzle-orm/bun-sqlite';
import { pointsTable } from './schema';
import { eq } from 'drizzle-orm';

const db = drizzle({
  schema: { points: pointsTable },
  connection: {
    source: './db.sqlite',
  },
});

const key: string = (process.env as any).MAPS_API_KEY!;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 6,000 requests per minute and 15,000 requests per day

// const client = new Client();
// const r = await client.elevation({
//   params: {
//     locations: [{ lat: 45, lng: -110 }],
//     key,
//   },
// });

// console.log(r?.data?.results[0]?.elevation);

// coords are usually 4,387m from one another
const radius = 4380 / 2;

const results = await db.query.points.findMany({
  where(points, { eq }) {
    return eq(points.kabupaten, 'Nias Utara');
    // return eq(points.province, 'North Sumatra');
  },
});

let i = 0;
for (const { id, latitude, longitude } of results) {
  // ?size=600x300&fov=90&heading=235&pitch=10
  const url = new URL('https://maps.googleapis.com/maps/api/streetview/metadata');
  url.searchParams.set('location', `${latitude},${longitude}`);
  url.searchParams.set('radius', `${radius}`);
  url.searchParams.set('return_error_code', 'true');
  url.searchParams.set('source', 'outdoor');
  url.searchParams.set('key', key);

  const res = await fetch(url.toString());
  console.log(i, res.status);

  if (res.ok) {
    const json = await res.json();
    await db
      .update(pointsTable)
      .set({
        hasStreetviewCoverage: json.status === 'OK' ? 1 : 0,
        svDate: json.date,
        svCopyright: json.copyright,
        svLatitude: json.location?.lat,
        svLongitude: json.location?.lng,
        svPanoId: json.pano_id,
      })
      .where(eq(pointsTable.id, id));
  } else {
    await db
      .update(pointsTable)
      .set({
        hasStreetviewCoverage: 0,
      })
      .where(eq(pointsTable.id, id));
  }
  i++;
}

console.log(results.length);
console.log('done');
