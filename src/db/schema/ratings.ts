import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { recipeTable } from "./recipe";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const ratingsTable = pgTable(
  "ratings",
  {
    value: integer().notNull(),
    recipeId: text()
      .notNull()
      .references(() => recipeTable.id, { onDelete: "cascade" }),
    authorId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.authorId] })]
);

export const ratingsRelations = relations(ratingsTable, ({ one }) => ({
  recipe: one(recipeTable, {
    fields: [ratingsTable.recipeId],
    references: [recipeTable.id],
  }),
  rater: one(usersTable, {
    fields: [ratingsTable.authorId],
    references: [usersTable.id],
  }),
}));
