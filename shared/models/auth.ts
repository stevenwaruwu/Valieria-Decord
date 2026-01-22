import { mysqlTable, varchar, timestamp, json, index, text } from "drizzle-orm/mysql-core";

// Custom Auth Users table
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Using email or username as ID
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // Hashed password
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
