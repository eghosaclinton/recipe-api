import { db } from "../db/connect";
import crypto from "crypto";
import { redisClient } from "../lib/redis";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "../lib/email";
import type { RequestRegister, RequestSignIn } from "../json-schemas/user";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { UserInsert, usersTable } from "../db/schema";
import * as argon2 from "argon2";
export class UserControllers {
  options = {
    type: argon2.argon2id,
    // memoryCost: 16384,
    memoryCost: 32768,
    timeCost: 3,
    parallelism: 1,
  };
  constructor() {}

  async register(req: RequestRegister, reply: FastifyReply) {
    const body = req.body;

    const userWithEmail = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, body.email as string),
    });

    const userWithName = await db.query.usersTable.findFirst({
      where: eq(usersTable.userName, body.userName as string),
    });

    if (userWithEmail) {
      reply.send({ message: "User with email already exists!" }).status(400);
      return;
    }

    if (userWithName) {
      reply.send({ message: "User with username already exists!" }).status(400);
      return;
    }

    const hashPassword = await argon2.hash(body.password!, this.options);

    const userCredentials = {
      email: body.email,
      userName: body.userName,
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
      const [{ userName, email, id }] = await db
        .insert(usersTable)
        .values({ ...JSON.parse(cachedCredentials), emailVerified: true })
        .returning()
        .onConflictDoNothing({ target: usersTable.email });

      await redisClient.del(q);

      const SESSION = app.jwt.sign({
        userName,
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

  async signIn(req: RequestSignIn, reply: FastifyReply) {
    const body = req.body;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, body.email as string),
    });

    if (user) {
      const isPasswordCorrect = await argon2.verify(
        user.password,
        body.password
      );

      if (isPasswordCorrect) {
        const SESSION = await reply.jwtSign({
          userName: user.userName,
          email: user.email,
          id: user.id,
        });

        await reply
          .setCookie("JSESSION", SESSION, {
            httpOnly: true,
            // secure: true, // only over HTTPS
            sameSite: "strict",
            path: "/",
            maxAge: 3600,
          })
          .send({ message: "successfully logged in" })
          .redirect(body.callback)
          .status(200);
        return;
      }
    }

    reply.send({ message: "Email or Password is incorrect" }).status(400);
  }

  async signOut(_req: FastifyRequest, reply: FastifyReply) {
    reply.clearCookie("JSESSION").send({ message: "logged out" }).status(200);
  }

  async getProfile(req: FastifyRequest, reply: FastifyReply) {
    const user = req.user as {
      userName: string;
      email: string;
      id: string;
    };

    const profile =  await db.query.usersTable.findFirst({
      where: eq(usersTable.email, user.email),
    });

    reply.send({
      name: profile?.name,
      userName: profile?.userName,
      id: profile?.id,
      email: profile?.email,
      image: profile?.image,
      emailVerified: profile?.emailVerified,
      joinedOn: profile?.createdAt
    }).status(200)
  }

  //TODO: write the hooks that apend the decoded jwt to the req.user and for prevalidation auth and this set profile controller as well as the reciper controllers
  setProfile(req: FastifyRequest, reply: FastifyReply) {}
}
