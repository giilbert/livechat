import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { extractAuth } from "../auth-middleware";
import { publicProcedure, router } from "../trpc-config";
import { chatRouter } from "./chats";

export const appRouter = router({
  getSession: publicProcedure
    .use(extractAuth)
    .query(({ ctx }) => (ctx.user ? { user: ctx.user } : null)),
  chat: chatRouter,
});

// Export type router type signature,
// NOT the router itself.
export type TRPCRouter = typeof appRouter;

export type In = inferRouterInputs<TRPCRouter>;
export type Out = inferRouterOutputs<TRPCRouter>;
export type FullSession = NonNullable<Out["getSession"]>;
