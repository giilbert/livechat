"use client";

import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "./button";

export const SignInButton: React.FC<React.ComponentProps<typeof Button>> = (
  props
) => {
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
      onClick={() => {
        signIn.mutate();
      }}
      isLoading={signIn.isPending || signIn.isSuccess}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export const SignOutButton: React.FC<React.ComponentProps<typeof Button>> = (
  props
) => {
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
      onClick={() => {
        signOut.mutate();
      }}
      isLoading={signOut.isPending || signOut.isSuccess}
      {...props}
    >
      {props.children}
    </Button>
  );
};
