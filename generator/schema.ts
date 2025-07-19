import { int, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pointsTable = sqliteTable('points', {
  id: int().primaryKey({ autoIncrement: true }),
  kabupaten: text().notNull(),
  province: text().notNull(),
  latitude: real().notNull(),
  longitude: real().notNull(),
  hasStreetviewCoverage: int('boolean'),
  svCopyright: text(),
  svLatitude: real(),
  svLongitude: real(),
  svPanoId: text(),
  svDate: text(),
});
