import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/server/db";
import { assertEnv } from "@/lib/utils";

export const authServer = betterAuth({
  baseURL: assertEnv("VITE_APP_URL", process.env.VITE_APP_URL),
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: { enabled: false },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: assertEnv("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID),
      clientSecret: assertEnv(
        "GOOGLE_CLIENT_SECRET",
        process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },
  advanced: {
    database: { generateId: false },
  },
  user: {
    additionalFields: {
      lastChatId: {
        type: "string",
        required: false,
      },
    },
  },
});
