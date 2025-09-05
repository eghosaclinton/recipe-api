import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user";
import { commentsTable } from "./comments";

export const commentLikesTable = pgTable(
  "comment_likes",
  {
    likerId: text()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    commentId: text()
      .notNull()
      .references(() => commentsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.likerId, table.commentId] })]
);

export const commentLikesRelations = relations(
  commentLikesTable,
  ({ one }) => ({
    liker: one(usersTable, {
      fields: [commentLikesTable.likerId],
      references: [usersTable.id],
    }),
    comment: one(commentsTable, {
      fields: [commentLikesTable.commentId],
      references: [commentsTable.id],
    }),
  })
);
