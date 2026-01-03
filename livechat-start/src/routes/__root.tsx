import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCClient } from "@trpc/client";
import type { TRPCRouter } from "@/server/trpc/routes";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import {
  updateTheme,
  ThemeProvider,
  THEME_STORAGE_KEY,
} from "@/components/theme";

type RouterContext = {
  queryClient: QueryClient;
  trpcClient: TRPCClient<TRPCRouter>;
  trpc: TRPCOptionsProxy<TRPCRouter>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "livechat" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.getSession.queryOptions()
    );
  },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <ScriptOnce>{`(() => {${updateTheme.toString()};updateTheme("${THEME_STORAGE_KEY}");})()`}</ScriptOnce>
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
