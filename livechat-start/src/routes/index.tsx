import { SignInButton } from "@/components/auth";
import { InfoView } from "@/components/info-view";
import { useSession } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.chat.list.queryOptions()
    );
  },
});

function App() {
  const session = useSession();

  return (
    <div className="w-full flex p-4 pt-6 flex-col items-center h-screen">
      {session ? (
        <div className="w-full h-full max-w-xl">
          <InfoView />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 h-full justify-center">
          <p>A chat app for the slow typers and the impatient</p>
          <SignInButton className="w-full">Sign In!</SignInButton>
        </div>
      )}
    </div>
  );
}
