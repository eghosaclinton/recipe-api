import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

const url =
  process.env.NODE_ENV! == "production"
    ? process.env.REDIS_URL_PROD!
    : process.env.REDIS_URL_DEV!;
    
export const redisClient = createClient({ url });
