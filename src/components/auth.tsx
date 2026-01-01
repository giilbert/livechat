"use client";

import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export const SignInButton: React.FC = () => {
  const signIn = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async () => {
      return await authClient.signIn.social({
        provider: "google",
      });
    },
  });

  return (
    <Button
      className="w-full"
      onClick={() => {
        signIn.mutate();
      }}
      isLoading={signIn.isPending || signIn.isSuccess}
    >
      sign in
    </Button>
  );
};

export const SignOutButton: React.FC = () => {
  const router = useRouter();
  const signOut = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      await authClient.signOut();
      router.refresh();
    },
  });

  return (
    <Button
      className="w-full"
      onClick={() => {
        signOut.mutate();
      }}
      isLoading={signOut.isPending || signOut.isSuccess}
    >
      sign out
    </Button>
  );
};
