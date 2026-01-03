import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routes";
import { createContext } from "@/server/trpc/trpc-context";
import { createFileRoute } from "@tanstack/react-router";
import chalk from "chalk";
import { TRPCError } from "@trpc/server";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    createContext: () => createContext(request),
    endpoint: "/api/trpc",
    onError({ error }: { error: unknown }) {
      if (error instanceof TRPCError && error.code === "INTERNAL_SERVER_ERROR")
        console.error(chalk.bold.red("[trpc]"), error);
    },
  });
}

export const Route = createFileRoute("/api/trpc/$")({
  server: {
    handlers: {
      GET: handler,
      POST: handler,
    },
  },
});
