import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { userRoutes } from "./user";
import { fastifyJwt } from "@fastify/jwt";

export async function indexRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  //plugins

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
    cookie: {
      cookieName: "LMCSESSION", // name of cookie to check
      signed: false,
    },
    sign: {
      expiresIn: "12h",
    },
  });

  //hooks
  // fastify.addHook("preValidation", async (req, reply) => {
  //   const verified = await req.jwtVerify()

  //   return verified
  // });

  //services
  app.register(userRoutes, { prefix: "/user" });
  app.get(
    "/ok",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              ok: { type: "boolean" },
              host: { type: "string" },
            },
          },
        },
      },
    },
    async (req, reply) => {
      reply
        .send({
          ok: true,
          host: `${req.protocol}://${req.host}`,
        })
        .status(200);
    }
  );
}
