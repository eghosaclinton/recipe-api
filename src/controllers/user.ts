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
    const credentials = req.body as unknown as UserInsert;
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
      reply.send({ message: "User with email already exists!" }).status(400);
      return;
    }

    const hashPassword = await argon2.hash(credentials.password, options);

    const userCredentials = {
      ...credentials,
      password: hashPassword,
    };

    const token = crypto.randomBytes(16).toString("hex");

    await redisClient.set(token, JSON.stringify(userCredentials));

    const { email, name } = userCredentials;

    await sendVerificationEmail({
      token,
      email,
      callback: `https://x.com/a1s0sa`,
      name,
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

      reply.send("email verified");
      reply.redirect(`${callback}`);

      //do something about rediraction and cookies
      // await reply.setCookie("LMCSESSION", q, {
      //   httpOnly: true,
      //   secure: true, // only over HTTPS
      //   sameSite: "strict",
      //   path: "/",
      //   maxAge: 3600,
      // });
    }

    reply.send("inavalid verification token.");
  }

  signIn() {}

  getProfile() {}

  setProfile() {}
}
