import { type FastifyInstance } from "fastify";
import { RecipeControllers } from "../../controllers/recipe";

export function recipeRoutes (app: FastifyInstance){
    const routes = new RecipeControllers()
}