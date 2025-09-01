import FastifyApp from "./app";

const app = FastifyApp();

app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
