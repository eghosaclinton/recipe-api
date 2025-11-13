import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { recipeTagsTable } from "./recipeTags";

export const tagsTable = pgTable("tags", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).unique(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  recipeTags: many(recipeTagsTable),
}));
