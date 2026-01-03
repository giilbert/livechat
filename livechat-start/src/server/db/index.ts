import { drizzle } from "drizzle-orm/libsql/web";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";
import chalk from "chalk";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle({
  client,
  schema,
  logger: {
    logQuery(query, _params) {
      console.log(chalk.gray(`[query] ${query}`));
    },
  },
});
