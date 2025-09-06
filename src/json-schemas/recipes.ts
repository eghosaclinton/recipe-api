import type { FastifyRequest, FastifySchema } from "fastify";
import type { SchemaProperties } from "../utils/types";

export const createRecipeSchema = {
  body: {
    type: "object",
    required: ["name", "description", "directions", "tags", "ingredients"],
    properties: {
      name: { type: "string", maxLength: 255 },
      description: { type: "string", maxLength: 4095 },
      directions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            step: { type: "number" },
            text: { type: "string" },
            image: { type: "string" },
          },
          required: ["step", "text"],
          additionalProperties: false,
        },
      },
      ingredients: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            order: { type: "number" },
            quantity: { type: "number" },
          },
          required: ["name", "order", "quantity"],
          additionalProperties: false,
        },
      },
      tags: {
        type: "array",
        items: { type: "string" },
      },
      image: { type: "string" },
      coverImage: { type: "string" },
    },
    minProperties: 3,
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        message: { type: "string" },
      },
      required: ["statusCode", "message"],
      additionalProperties: false,
    },
    400: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        code: { type: "string" },
        error: { type: "string" },
        message: { type: "string" },
      },
      required: ["statusCode", "code", "error", "message"],
      additionalProperties: false,
    },
  },
} as const;

export type CreateRecipe = SchemaProperties<typeof createRecipeSchema>;
export type CreateRecipeRequest = FastifyRequest<{
  Body: CreateRecipe["body"];
  Reply: CreateRecipe["response"];
}>;
