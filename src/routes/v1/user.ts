import { FastifyInstance } from "fastify";
import { registerSchema } from "../../json-schemas/user";
import { UserControllers } from "../../controllers/user";

export async function userRoutes(app: FastifyInstance){
    const user = new UserControllers()

    // app.addHook("preHandler", ()=>{

    // })
    app.post("/register", {schema: registerSchema}, user.register)
    app.post("login", user.signIn)
    app.get("/profile", user.getProfile)
    app.put("/profile", user.setProfile)
}