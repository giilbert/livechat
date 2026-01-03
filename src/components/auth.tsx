"use client";

import { signInOptions, signOutOptions } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./button";
import { useRouter } from "@tanstack/react-router";

export const SignInButton: React.FC<React.ComponentProps<typeof Button>> = (
  props
) => {
  const signIn = useMutation(signInOptions);

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
  const signOut = useMutation(signOutOptions);

  return (
    <Button
      onClick={() => {
        signOut.mutate(undefined, {
          onSuccess() {
            router.navigate({ to: "/" });
          },
        });
      }}
      isLoading={signOut.isPending || signOut.isSuccess}
      {...props}
    >
      {props.children}
    </Button>
  );
};
