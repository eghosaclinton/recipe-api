import * as dotenv from "dotenv";
import * as schema from "./schema";
import { localConnect } from "./local";
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

dotenv.config();
const isProd = process.env.NODE_ENV! == "production";

// neonConfig.fetchConnectionCache = true;

function prodConnect() {
  const sql = neon(process.env.POSTGRES_URL_PROD!);

  const db = drizzle(sql, { logger: true, schema });

  return db;
}

export const db = isProd ? prodConnect() : localConnect();
