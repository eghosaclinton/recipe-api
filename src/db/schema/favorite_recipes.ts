import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user";
import { recipeTable } from "./recipe";

export const favoriteRecipesTable = pgTable(
  "favorite_recipes",
  {
    recipeId: text(),
    userId: text(),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.recipeId] })]
);

export const favoriteRecipesRelations = relations(
  favoriteRecipesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [favoriteRecipesTable.userId],
      references: [usersTable.id],
    }),
    recipe: one(recipeTable, {
      fields: [favoriteRecipesTable.recipeId],
      references: [recipeTable.id],
    }),
  })
);
