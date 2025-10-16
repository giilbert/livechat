"use client";

import { MafProvider } from "@usemaf/react";

export const Providers: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <MafProvider server="dev">{children}</MafProvider>;
};
