import type { FastifyRequest, FastifySchema } from "fastify";
import type { SchemaProperties } from "../utils/types";

export const registerSchema = {
  body: {
    type: "object",
    required: ["name", "password", "email", "userName", "callback"],
    properties: {
      name: { type: "string" },
      userName: { type: "string", maxLength: 15 },
      password: { type: "string" },
      email: { type: "string" },
      callback: { type: "string" },
    },
    minLength: 3,
    additionalProperties: false,
  },
  response: {
    "200": {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        code: { type: "string" },
        error: { type: "string" },
        message: { type: "string" },
      },
    },
  },
} as const;

export const signInSchema = {
  body: {
    type: "object",
    required: ["password", "email", "callback"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
      callback: { type: "string" },
    },
    minLength: 3,
    additionalProperties: false,
  },
  response: {
    "400": {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        code: { type: "string" },
        error: { type: "string" },
        message: { type: "string" },
      },
    },
  },
} as const;

export const signOutSchema: FastifySchema = {
  response: {
    200: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        message: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        statusCode: { type: "number" },
        code: { type: "string" },
        error: { type: "string" },
        message: { type: "string" },
      },
    },
  },
} as const;

export type Register = SchemaProperties<typeof registerSchema>;
export type RegisterRequest = FastifyRequest<{
  Body: Register["body"];
  Reply: Register["response"];
}>;

export type SignIn = SchemaProperties<typeof signInSchema>;
export type SignInRequest = FastifyRequest<{
  Body: SignIn["body"];
  Reply: SignIn["response"];
}>;
