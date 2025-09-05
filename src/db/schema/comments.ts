import {
  foreignKey,
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user";
import { recipeTable } from "./recipe";
import { commentLikesTable } from "./commentLikes";

export const commentsTable = pgTable(
  "comments",
  {
    id: uuid().primaryKey().defaultRandom(),
    authorId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    recipeId: text()
      .notNull()
      .references(() => recipeTable.id, { onDelete: "cascade" }),
    parentId: text(),
    body: varchar({ length: 1023 }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }),
  ]
);

export const commentsRelations = relations(commentsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [commentsTable.authorId],
    references: [usersTable.id],
  }),
  recipe: one(recipeTable, {
    fields: [commentsTable.recipeId],
    references: [recipeTable.id],
  }),
  parent: one(commentsTable, {
    fields: [commentsTable.parentId],
    references: [commentsTable.id],
  }),
  children: many(commentsTable),
  likes: many(commentLikesTable),
}));
