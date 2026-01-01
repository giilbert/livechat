import { SignInButton } from "@/components/auth";
import { InfoView } from "@/components/info-view";
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
          <div className="w-full h-full max-w-xl">
            <InfoView session={session} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 h-full justify-center">
            <p>A chat app for the slow typers and the impatient</p>
            <SignInButton className="w-full">Sign In!</SignInButton>
          </div>
        )}
      </div>
    </HydrateClient>
  );
}
