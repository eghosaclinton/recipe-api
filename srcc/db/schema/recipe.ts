import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { ratingsTable } from "./ratings";
import { relations } from "drizzle-orm";
import { commentsTable } from "./comments";
import { recipeTagsTable } from "./recipeTags";
import { favoriteRecipesTable } from "./favorite_recipes";
import { recipeIngredientsTable } from "./recipe_ingredients";

export const recipeTable = pgTable("recipes", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 4095 }).notNull(),
  directions: jsonb("directions")
    .notNull()
    .$type<{ step: number; text: string; image?: string }[]>(),
    //TODO: make sure user can insert tags while posting recipes(if they dont exist yet)
  tags: jsonb().notNull().$type<{ name: string; id: number }[]>(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  image: text("image"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const recipeRelations = relations(recipeTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [recipeTable.userId],
    references: [usersTable.id],
  }),
  ratings: many(ratingsTable),
  comments: many(commentsTable),
  recipeTags: many(recipeTagsTable),
  favoriteRecipes: many(favoriteRecipesTable),
  ingredients: many(recipeIngredientsTable),
}));
