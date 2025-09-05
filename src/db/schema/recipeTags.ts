import { pgTable, integer, text, primaryKey, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipeTable } from "./recipe";
import { tagsTable } from "./tags";

export const recipeTagsTable = pgTable(
  "recipe_tags",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipeTable.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.tagId] })]
);

export const recipeTagsRelations = relations(recipeTagsTable, ({ one }) => ({
  recipe: one(recipeTable, {
    fields: [recipeTagsTable.recipeId],
    references: [recipeTable.id],
  }),
  tag: one(tagsTable, {
    fields: [recipeTagsTable.tagId],
    references: [tagsTable.id],
  }),
}));
