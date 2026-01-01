import { createCallerFactory, createTRPCRouter } from "../trpc";
import { chatRouter } from "./chats";

export const appRouter = createTRPCRouter({
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
