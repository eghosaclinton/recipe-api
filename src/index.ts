import Fastify from "fastify";
import * as dotenv from "dotenv";
import { indexRoute } from "./routes/v1";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

//plugins
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

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
