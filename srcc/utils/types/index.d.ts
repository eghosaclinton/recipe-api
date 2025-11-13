import { FastifyRequest } from "fastify";
import { FromSchema, type JSONSchema } from "json-schema-to-ts";

// Takes a schema object { body?, params?, querystring?, headers?, response? }
export type RequestFromSchema<TSchema extends Record<string, any>> =
  FastifyRequest<{
    Body: TSchema extends { body: infer B } ? FromSchema<B> : never;
    Params: TSchema extends { params: infer P } ? FromSchema<P> : never;
    Querystring: TSchema extends { querystring: infer Q }
      ? FromSchema<Q>
      : never;
    Headers: TSchema extends { headers: infer H } ? FromSchema<H> : never;
    Reply: TSchema extends { response: { 200: infer R } }
      ? FromSchema<R>
      : unknown;
  }>;

export type SchemaProperties<T> = {
  [K in keyof T]: T[K] extends JSONSchema ? FromSchema<T[K]> : never;
};
