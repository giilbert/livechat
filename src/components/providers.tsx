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
              url: "https://onmaf.gilbertz.me",
              app: "gilbert/livechat",
            }
      }
    >
      {children}
    </MafProvider>
  );
};
