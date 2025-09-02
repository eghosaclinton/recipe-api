import { db } from "../db/connect";
import crypto from "crypto";
import { redisClient } from "../lib/redis";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../lib/email";
import type { RequestRegister } from "../json-schemas/user";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserInsert, usersTable } from "../db/schema";
import * as argon2 from "argon2";
export class UserControllers {
  constructor() {}

  async register(req: RequestRegister, reply: FastifyReply) {
    const body = req.body;
    const options = {
      type: argon2.argon2id,
      // memoryCost: 16384,
      memoryCost: 32768,
      timeCost: 3,
      parallelism: 1,
    };

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, body.email as string),
    });

    if (user) {
      reply.send({ message: "User with email already exists!" }).status(400);
      return;
    }

    const hashPassword = await argon2.hash(body.password!, options);

    const userCredentials = {
      email: body.email,
      name: body.name,
      password: hashPassword,
    };

    const token = crypto.randomBytes(16).toString("hex");

    await redisClient.set(token, JSON.stringify(userCredentials));

    const { email, name } = userCredentials;

    await sendVerificationEmail({
      token,
      email: email!,
      callback: body.callback!,
      name: name!,
    });

    reply.status(200).send({ message: "Check email for verification." });
  }

  async verify(req: FastifyRequest, reply: FastifyReply, app: FastifyInstance) {
    const { q, callback } = req.query as { q: string; callback: string };
    const cachedCredentials = await redisClient.get(q);

    if (cachedCredentials) {
      const [{ name, email, id }] = await db
        .insert(usersTable)
        .values({ ...JSON.parse(cachedCredentials), emailVerified: true })
        .returning()
        .onConflictDoNothing({ target: usersTable.email });

      await redisClient.del(q);

      const SESSION = app.jwt.sign({
        name,
        email,
        id,
      });

      reply
        .setCookie("JSESSION", SESSION, {
          httpOnly: true,
          // secure: true, // only over HTTPS
          sameSite: "strict",
          path: "/",
          maxAge: 3600,
        })
        .redirect(`${callback}`);
    }

    reply.send("inavalid verification token or token has been used");
  }

  async signIn() {
    // const SESSION = app.jwt.sign({
    //   name,
    //   email,
    //   id,
    // });
    // await reply.setCookie("JSESSION", SESSION, {
    //   httpOnly: true,
    //   secure: true, // only over HTTPS
    //   sameSite: "strict",
    //   path: "/",
    //   maxAge: 3600,
    // });
  }

  async signOut() {}

  getProfile() {}

  setProfile() {}
}
