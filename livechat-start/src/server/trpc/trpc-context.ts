import { db } from "@/server/db";

export const createContext = (request: Request) => {
  return {
    request,
    db,
  };
};

export type TRPCContext = ReturnType<typeof createContext>;
