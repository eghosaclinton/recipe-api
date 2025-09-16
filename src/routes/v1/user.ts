import { FastifyInstance } from "fastify";
import {
  registerSchema,
  signInSchema,
  signOutSchema,
} from "../../json-schemas/user";
import { UserControllers } from "../../controllers/user";

export async function userRoutes(app: FastifyInstance) {
  const user = new UserControllers();

  app.post("/register", { schema: registerSchema }, user.register);
  app.get("/verify", (req, reply) => user.verify(req, reply, app));
  app.post("/login", { schema: signInSchema }, user.signIn);
  app.get(
    "/logout",
    {
      schema: signOutSchema,
      preValidation: async (req, reply) => {
        await req.jwtVerify();
      },
    },
    user.signOut
  );
  // app.get("/profile", user.getProfile);
  // app.put("/profile", user.setProfile);
}
