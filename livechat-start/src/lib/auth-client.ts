import { createAuthClient } from "better-auth/react";
import { mutationOptions, useSuspenseQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { assertEnv } from "./utils";
import { useTRPC } from "./trpc-client";

export const authClient = createAuthClient({
  baseURL: assertEnv("VITE_APP_URL", import.meta.env.VITE_APP_URL),
});

export const signInOptions = mutationOptions({
  mutationKey: ["user-sign-in"],
  mutationFn: async () => {
    const res = await authClient.signIn.social({ provider: "google" });

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});

export const signOutOptions = mutationOptions({
  mutationKey: ["user-sign-out"],
  mutationFn: async () => {
    const res = await authClient.signOut();

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});

export const useSession = () => {
  const trpc = useTRPC();
  const query = useSuspenseQuery(trpc.getSession.queryOptions());
  if (query.status === "error") {
    console.warn("error fetching session", query.error);
    throw query.error;
  }
  return query.data;
};

export const useAssertedSession = () => {
  const session = useSession();
  if (!session) throw redirect({ to: "/" });
  return session;
};
