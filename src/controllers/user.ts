import { db } from "../db/connect";
import { eq } from "drizzle-orm";
import type { RequestRegister, Register } from "../json-schemas/user";
import type { FastifyRequest, FastifyReply } from "fastify";
import { UserInsert, UserSelect, usersTable } from "../db/schema";

export class UserControllers {
  constructor() {}

  async register(req: RequestRegister, reply: FastifyReply) {
    const credentials = req.body as UserInsert;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, credentials.email),
    });

    if (user) {
      reply.send("User with email already exists!").status(400);
      return;
    }

    const newUser = await db
      .insert(usersTable)
      .values(credentials)
      .returning()
      .onConflictDoNothing({ target: usersTable.email });

    const token = await reply.jwtSign(newUser[0]);
    await reply.setCookie("LMCSESSION", token, {
      httpOnly: true,
      secure: true, // only over HTTPS
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });
    reply.status(200).send({message: "New User successfully added."});
  }

  signIn() {}

  getProfile() {}

  setProfile() {}
}
