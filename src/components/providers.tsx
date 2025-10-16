"use client";

import { MafProvider } from "@usemaf/react";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <MafProvider
      server={
        process.env.NODE_ENV === "development"
          ? "dev"
          : {
              type: "platform",
              url: "https://maf-server.fly.dev",
              app: "gilbert/server",
            }
      }
    >
      {children}
    </MafProvider>
  );
};
