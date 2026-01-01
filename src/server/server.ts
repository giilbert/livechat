import { headers } from "next/headers";
import { cache } from "react";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { createCaller, type AppRouter } from "./routes/router";
import { createTRPCContext } from "./trpc";
import { createQueryClient } from "./query-client";
import { notFound } from "next/navigation";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext, {
  onError(error) {
    if (error.error.code === "NOT_FOUND") {
      notFound();
    }
  },
});

export const { trpc: trpcServer, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getQueryClient);
