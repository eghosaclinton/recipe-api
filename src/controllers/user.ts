import { db } from "../db/connect";
import { eq } from "drizzle-orm";
import type { RequestRegister } from "../json-schemas/user";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserInsert, UserSelect, usersTable } from "../db/schema";
import * as argon2 from "argon2";

const testToken ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjN2Q3YTgyLTJiZjEtNGIyYy05MTE0LTMwMWFlMTJiZThlNCIsIm5hbWUiOiJKb2huIiwiZW1haWwiOiJhY2Vpbm5vdmF0aW9uczBAZ21haWwuY29tIiwiaWF0IjoxNzU2MTE4NjgzLCJleHAiOjE3NTYxNjE4ODN9.6eQaYHUJfYERo7yikuz8p_c3ZEhCZcivxl2uMlgvtF4"

export class UserControllers {
  constructor() {}

  async register(req: RequestRegister, reply: FastifyReply) {
    const credentials = req.body as UserInsert;
    const options = {
      type: argon2.argon2id,
      // memoryCost: 16384,
      memoryCost: 32768,
      timeCost: 3,
      parallelism: 1,
    };

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, credentials.email),
    });

    if (user) {
      reply.send("User with email already exists!").status(400);
      return;
    }

    const hashPassword = await argon2.hash(credentials.password, options);

    const userCredentials = {
      ...credentials,
      password: hashPassword,
    };

    const newUser = await db
      .insert(usersTable)
      .values(userCredentials)
      .returning()
      .onConflictDoNothing({ target: usersTable.email });

    const token = await reply.jwtSign(newUser[0]);

    //email handler

    reply.status(200).send({ message: "Check email for verification." });
  }

  async verify(req: FastifyRequest, reply: FastifyReply, app: FastifyInstance) {
    const { q, callback } = req.query as { q: string; callback: string };
    const decodedPayload = app.jwt.decode(q) as UserSelect;

    if (decodedPayload) {
      const verifyEmail = await db
        .update(usersTable)
        .set({ emailVerified: true })
        .where(eq(usersTable.email, decodedPayload.email));

      reply.send("email verified");

      // await reply.setCookie("LMCSESSION", q, {
      //   httpOnly: true,
      //   secure: true, // only over HTTPS
      //   sameSite: "strict",
      //   path: "/",
      //   maxAge: 3600,
      // });

      reply.redirect(`${req.protocol}://${callback}`);
    }

    reply.send("inavalid verification token.");
  }

  signIn() {}

  getProfile() {}

  setProfile() {}
}
