import type { FastifyInstance } from "fastify";

interface AuthOptions {}

export async function myAuth(
  app: FastifyInstance,
  opts: AuthOptions,
  done: (err?: Error) => void
) {}
