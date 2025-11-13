import * as dotenv from "dotenv";
import { Pool } from "pg";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
dotenv.config();

export function localConnect() {
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL_DEV!,
  });

  const db = drizzle(pool, { schema });

  return db;
}
