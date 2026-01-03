import { InfoView } from "@/components/info-view";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$chatId")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.chat.list.queryOptions()
    );
  },
});

function RouteComponent() {
  return (
    <div>
      <div className="p-4 pt-6 flex gap-4 h-screen">
        <div className="w-96 border-r pr-4">
          <InfoView />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
