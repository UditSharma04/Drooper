import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

dotenv.config({path: ".env.local"})

if(!process.env.DATABASE_URL){
    throw new Error("Database url is not set in .env.local");
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // optional part but best practices

  migrations: { // using this so while migration all tables names in a good format
    table: "__drizzle_migration",
    schema: "public"
  },
  verbose: true, // shows everyting going behind the scenes like migration and all
  strict: true, // it dosen't stops you from doing anything , just asks for a popup
});
