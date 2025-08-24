import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import { userRoutes } from "./user";
import { fastifyJwt } from "@fastify/jwt";
import type { FastifyCookieOptions } from "@fastify/cookie";
import cookie from "@fastify/cookie";

export async function indexRoute(
  app: FastifyInstance,
  options: FastifyPluginOptions
) {
  //plugins
  app.register(
    cookie
    //   {
    //   secret: "my-secret", // for cookies signature
    //   parseOptions: {}     // options for parsing cookies
    // } as FastifyCookieOptions
  );

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
            },
          },
        },
      },
    },
    (_req, reply) => {
      reply.send({ ok: true }).status(200);
    }
  );
}
