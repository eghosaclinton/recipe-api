import {
  pgTable,
  varchar,
  uuid,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipeTable } from "./recipe";
import { ratingsTable } from "./ratings";
import { commentsTable } from "./comments";
import { commentLikesTable } from "./commentLikes";
import { favoriteRecipesTable } from "./favorite_recipes";
import { notificationsTable } from "./notifications";
import { followsTable } from "./follows";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  userName: varchar({ length: 15 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  recipes: many(recipeTable),
  ratings: many(ratingsTable),
  comments: many(commentsTable),
  notifications: many(notificationsTable),
  commentLikes: many(commentLikesTable),
  followers: many(followsTable, { relationName: "followees" }),
  followees: many(followsTable, { relationName: "followers" }),
  favoriteRecipes: many(favoriteRecipesTable),
}));

export type UserInsert = typeof usersTable.$inferInsert;
export type UserSelect = typeof usersTable.$inferSelect;
