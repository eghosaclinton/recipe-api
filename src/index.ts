import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: true,
});

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

fastify.get(
  "/",
  {
    schema: {
      description: "Hello world",
      response: {
        200: {
          type: "object",
          properties: {
            hello: { type: "string" },
          },
        },
      },
    },
  },
  (req, reply) => {
    reply.send({ hello: 1 });
  }
);

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
