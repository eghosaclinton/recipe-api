import type { FastifyReply, FastifyRequest } from "fastify";
import { CreateRecipeRequest } from "../json-schemas/recipes";
import { db } from "../db/connect";

export class RecipeControllers {
  constructor() {}

  async createRecipe(req: CreateRecipeRequest, reply: FastifyReply) {
    const recipeDetails = req.body;

    const user = req.user as {
      userName: string;
      email: string;
      id: string;
      iat: number;
      exp: number;
    };

    
  }
}
