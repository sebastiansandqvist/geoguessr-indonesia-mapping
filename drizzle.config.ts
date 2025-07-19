import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  out: './drizzle',
  schema: './generator/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:./db.sqlite',
  },
});
