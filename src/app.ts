import Fastify from "fastify";
import * as dotenv from "dotenv";
import { indexRoute } from "./routes/v1";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";
import { redisClient as client } from "./lib/redis";
dotenv.config();

export default function FastifyApp() {
  const fastify = Fastify({
    logger: false,
  });

  //redis
  (async () => await client.connect())();

  //plugins
  fastify.register(cookie);

  fastify.register(swagger, {
    openapi: {
      info: {
        title: "Recipe Api Docs",
        version: "1.0.0",
      },
    },
  });

  fastify.register(swaggerUI, {
    routePrefix: "/docs",
  });

  //services
  fastify.register(indexRoute, { prefix: "/api/v1" });

  fastify.get("/ping", (_req, reply) => {
    reply.send({ message: "pong" });
  });

  // fastify.get("/mail", async (_req, reply) => {
  //   await sendVerificationEmail({
  //     email: "aceinnovations0@gmail.com",
  //     name: "Aisosa",
  //     token: "123",
  //     callback: "something",
  //   });
  //   reply.send("sent mail");
  // });

  return fastify;
}
