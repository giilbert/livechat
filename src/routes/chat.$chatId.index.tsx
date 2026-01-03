import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$chatId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <div>Hello "/chat/{params.chatId}/"!</div>;
}
