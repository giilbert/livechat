import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import assert from "node:assert";
import { headers } from "next/headers";
import { cache } from "react";

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
assert(
  BETTER_AUTH_URL,
  "BETTER_AUTH_URL is not defined in environment variables"
);

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
assert(
  GOOGLE_CLIENT_ID,
  "GOOGLE_CLIENT_ID is not defined in environment variables"
);
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
assert(
  GOOGLE_CLIENT_SECRET,
  "GOOGLE_CLIENT_SECRET is not defined in environment variables"
);

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      lastChatId: {
        type: "string",
        required: false,
      },
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});

export const getSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};
