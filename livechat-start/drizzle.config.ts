import { assertEnv } from "@/lib/utils";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: assertEnv("DATABASE_URL", process.env.DATABASE_URL),
    authToken: assertEnv(
      "DATABASE_AUTH_TOKEN",
      process.env.DATABASE_AUTH_TOKEN
    ),
  },
});
