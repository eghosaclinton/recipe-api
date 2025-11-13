import type { FastifyReply } from "fastify";
import { CreateRecipeRequest } from "../json-schemas/recipes";
import { db } from "../db/connect";
import {
  recipeTable,
  recipeIngredientsTable,
  recipeTagsTable,
} from "../db/schema";

export class RecipeControllers {
  constructor() {}

  
  async createRecipe(req: CreateRecipeRequest, reply: FastifyReply) {
    const { name, description, directions, tags, ingredients } = req.body;

    

    const user = req.user as {
      userName: string;
      email: string;
      id: string;
      iat: number;
      exp: number;
    };

    return await db.transaction(async (tx) => {
      const [newRecipe] = await tx
        .insert(recipeTable)
        .values({
          name,
          description,
          directions,
          tags,
          userId: user.id,
        })
        .returning()
        .onConflictDoNothing();

      if (tags.length > 0) {
        await tx
          .insert(recipeTagsTable)
          .values(
            tags.map(({ id }) => ({ tagId: id, recipeId: newRecipe.id }))
          );
      }

      if (ingredients.length > 0) {
        await tx
          .insert(recipeIngredientsTable)
          .values(
            [{
              name: ingredients[0].name,
              quantity: ingredients[0].quantity,
              order: ingredients[0].order,
              recipeId: newRecipe.id
            }]
          );
      }
    });
  }
}
