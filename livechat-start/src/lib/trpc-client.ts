import type { TRPCRouter } from "@/server/trpc/routes";
import {
  createTRPCClient as _createTRPCClient,
  httpBatchStreamLink,
} from "@trpc/client";
import superjson from "superjson";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { isomorphicHeaders } from "@/lib/get-isomorphic-headers.ts";

export const createTRPCClient = () =>
  _createTRPCClient<TRPCRouter>({
    links: [
      httpBatchStreamLink({
        transformer: superjson,
        url: `${process.env.BASE_URL ?? ""}/api/trpc`,
        headers: async () => isomorphicHeaders(),
      }),
    ],
  });
export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<TRPCRouter>();
