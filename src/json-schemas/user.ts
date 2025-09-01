import type { FastifyRequest } from "fastify";
import { FromSchema, type JSONSchema } from "json-schema-to-ts";

type SchemaProperties<T> = {
  [K in keyof T]:  T[K] extends JSONSchema ? FromSchema<T[K]> : never;
};

export const registerSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      password: { type: "string" },
      email: { type: "string" }, 
    },
  },
  response: {
    "200": {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
} as const;

export type Register = SchemaProperties<typeof registerSchema>
export type RequestRegister = FastifyRequest<{
  Body: Register["body"],
  Reply: Register['response']
}>
