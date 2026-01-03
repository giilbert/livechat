import {
  index,
  integer,
  primaryKey,
  sqliteTable,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { text } from "drizzle-orm/sqlite-core";

export const example = sqliteTable("example", {
  id: integer("id").primaryKey({ autoIncrement: true }),
});

export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const chat = sqliteTable("chat", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chatMember = sqliteTable(
  "chat_member",
  {
    chatId: text("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    primaryKey({ columns: [table.chatId, table.userId] }),
    index("idx_chat_member_chat_id").on(table.chatId),
    index("idx_chat_member_user_id").on(table.userId),
  ]
);

export const message = sqliteTable(
  "message",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    chatId: text("chat_id")
      .notNull()
      .references(() => chat.id, { onDelete: "cascade" }),
    senderChatId: text("sender_chat_id").notNull(),
    senderUserId: text("sender_user_id").notNull(),
  },
  (table) => [
    index("idx_message_chat_id").on(table.chatId),
    index("idx_message_sender").on(table.senderChatId, table.senderUserId),
  ]
);
