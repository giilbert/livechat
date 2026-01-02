import { createAuthClient } from "better-auth/react";
import { mutationOptions } from "@tanstack/react-query";

export const authClient = createAuthClient({
  baseURL: process.env.APP_URL,
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
