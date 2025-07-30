import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";

export const todo = pgTable("todo", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  completed: boolean("completed").default(false),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
