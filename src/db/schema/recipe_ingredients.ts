import {
  pgTable,
  serial,
  varchar,
  numeric,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipeTable } from "./recipe";

export const recipeIngredientsTable = pgTable("recipe_ingredients", {
  id: serial("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipeTable.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 3 }), // exact decimals
  unit: text("unit"),
  order: integer("order").notNull(),
});

export const recipeIngredientsRelations = relations(
  recipeIngredientsTable,
  ({ one }) => ({
    recipe: one(recipeTable, {
      fields: [recipeIngredientsTable.recipeId],
      references: [recipeTable.id],
    }),
  })
);
