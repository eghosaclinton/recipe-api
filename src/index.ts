import Fastify from "fastify";
import * as dotenv from "dotenv";
import { indexRoute } from "./routes/v1";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { sendVerificationEmail } from "./lib/email";

dotenv.config();

const fastify = Fastify({
  logger: false,
});

//plugins
fastify.register(swagger, {
  openapi: {
    info: {
      title: "Recipe Api Docs",
      version: "1.0.0",
    },
  },
});

fastify.register(swaggerUI, {
  routePrefix: "/docs",
});

//services
fastify.register(indexRoute, { prefix: "/api/v1" });

fastify.get("/mail", async (_req, reply)=>{
  await sendVerificationEmail({email: "aceinnovations0@gmail.com", name: "Aisosa", token: "123", callback:"something"})
  reply.send("sent mail")
}) 

fastify.listen({ port: 3001 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
