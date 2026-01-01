import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../../generated/prisma/client";
import assert from "node:assert";

const DATABASE_URL = process.env.DATABASE_URL;
assert(DATABASE_URL, "DATABASE_URL is not set in environment variables");

const isLocalhost = DATABASE_URL.includes("localhost");

const adapter = isLocalhost
  ? new PrismaPg({ connectionString: DATABASE_URL })
  : new PrismaNeon({ connectionString: DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
