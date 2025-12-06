import { redisClient as client } from "./lib/redis";


export default function FastifyApp() {
  (async () => await client.connect())();
}
