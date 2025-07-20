import { drizzle } from 'drizzle-orm/bun-sqlite';
import { count, eq, isNull } from 'drizzle-orm';
import { pointsTable } from './schema';

const db = drizzle({
  schema: { points: pointsTable },
  connection: {
    source: './db.sqlite',
  },
});

const withCoverage = await db.query.points.findMany({
  where: eq(pointsTable.hasStreetviewCoverage, true),
});

await Bun.write('./data/points-covered.json', JSON.stringify(withCoverage, null, 2));

const withoutCoverage = await db.query.points.findMany({
  where: eq(pointsTable.hasStreetviewCoverage, false),
});

await Bun.write('./data/points-not-covered.json', JSON.stringify(withoutCoverage, null, 2));

console.log('done');
