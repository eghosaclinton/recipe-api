import * as dotenv from "dotenv";
import { db } from "./connect";
import * as argon2 from "argon2";
import { tagsTable, usersTable } from "./schema";

dotenv.config();

// const db = drizzle(process.env.POSTGRES_URL!);

async function main() {
  // const password = "password";
  // const options = {
  //   type: argon2.argon2id,
  //   // memoryCost: 16384,
  //   memoryCost: 32768,
  //   timeCost: 3,
  //   parallelism: 1,
  // };

  // const hashPassword = await argon2.hash(password, options);
  // const user: typeof usersTable.$inferInsert = {
  //   name: "John",
  //   password: hashPassword,
  //   email: "aceinnovations0@gmail.com",
  // };

  // await db.insert(usersTable).values(user);
  // console.log("New user created!");

  // const users = await db.select().from(usersTable);
  // console.log("Getting all users from the database: ", users);
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

  //   await db
  //     .update(usersTable)
  //     .set({
  //       age: 31,
  //     })
  //     .where(eq(usersTable.email, user.email));
  //   console.log('User info updated!')

  //   await db.delete(usersTable).where(eq(usersTable.email, user.email));
  //   console.log('User deleted!')

  const tags = await db.insert(tagsTable).values([
  { name: "breakfast" },
  { name: "lunch" },
  { name: "dinner" },
  { name: "snack" },
  { name: "dessert" },
  { name: "vegan" },
  { name: "vegetarian" },
  { name: "gluten-free" },
  { name: "dairy-free" },
  { name: "low-carb" },
  { name: "high-protein" },
  { name: "spicy" },
  { name: "quick" },
  { name: "easy" },
  { name: "healthy" },
  { name: "comfort food" },
  { name: "grilled" },
  { name: "baked" },
  { name: "fried" },
  { name: "soup" }
])
}

main();
