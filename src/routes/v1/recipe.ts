import { type FastifyInstance } from "fastify";
import { createRecipeSchema } from "../../json-schemas/recipes";
import { RecipeControllers } from "../../controllers/recipe";

export function recipeRoutes(app: FastifyInstance) {
  const recipes = new RecipeControllers();
    app.addHook("preValidation", async (req, reply)=>{
      await req.jwtVerify()
  })

  app.post("/", {schema: createRecipeSchema}, recipes.createRecipe);
}
