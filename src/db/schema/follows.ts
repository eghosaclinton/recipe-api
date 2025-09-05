import {
  pgTable,
  text,
  primaryKey,
  timestamp,
  check,
  uuid,
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations, sql } from "drizzle-orm";

export const followsTable = pgTable(
  "follows",
  {
    followerId: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    followeeId: uuid()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followeeId] }),
    check("no_aelf_follow", sql`${table.followerId} <> ${table.followeeId}`),
  ]
);

export const followsRelations = relations(followsTable, ({ one }) => ({
  followers: one(usersTable, {
    fields: [followsTable.followerId],
    references: [usersTable.id],
    relationName: "followers"
  }),
  followees: one(usersTable, {
    fields: [followsTable.followeeId],
    references: [usersTable.id],
    relationName: "followees"
  }),
}));
