import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { TRPCProvider } from "@/lib/trpc-client";
import { createTRPCClient } from "@/lib/trpc-client";
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: superjson.serialize },
      hydrate: { deserializeData: superjson.deserialize },
      queries: {
        refetchOnMount: false,
      },
    },
  });

  const trpcClient = createTRPCClient();

  const serverHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    context: {
      trpc: serverHelpers,
      trpcClient,
      queryClient,
    },
    Wrap: (props) => (
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};
