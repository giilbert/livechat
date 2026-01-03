import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/trpc/routes";
import { createContext } from "@/server/trpc/trpc-context";
import { createFileRoute } from "@tanstack/react-router";
import chalk from "chalk";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    createContext: () => createContext(request),
    endpoint: "/api/trpc",
    onError({ error }) {
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
