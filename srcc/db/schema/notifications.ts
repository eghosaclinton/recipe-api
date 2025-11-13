import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./user";
import { relations } from "drizzle-orm";

export const notificationsTable = pgTable("notifications", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  Image: text(),
  body: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});


export const notificationsRelations = relations(notificationsTable, ({one})=>({
    user: one(usersTable, {
        fields: [notificationsTable.userId], 
        references: [usersTable.id]
    })
}))
