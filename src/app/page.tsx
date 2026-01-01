import { SignInButton, SignOutButton } from "@/components/auth";
import { ChatList } from "@/components/chat-list";
import { ModeToggle } from "@/components/theme";
import { getSession } from "@/lib/auth-server";
import { HydrateClient, trpcServer } from "@/server/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session && session.user.lastChatId)
    throw redirect(`/chats/${session.user.lastChatId}`);

  await trpcServer.chat.list.prefetch();

  return (
    <HydrateClient>
      <div className="w-full flex p-4 pt-6 flex-col items-center h-screen">
        {session ? (
          <div className="flex flex-col gap-2 w-full max-w-2xl h-full">
            <ChatList />

            <footer className="flex items-center gap-2 border-t pt-4 mt-auto">
              <p>
                Signed in as{" "}
                <span className="font-semibold">{session.user.name}</span>
              </p>
              <SignOutButton variant="secondary" className="ml-auto">
                Sign Out
              </SignOutButton>
              <ModeToggle />
            </footer>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p>A chat app for the slow typers and the impatient</p>
            <SignInButton>Sign In!</SignInButton>
          </div>
        )}
      </div>
    </HydrateClient>
  );
}
