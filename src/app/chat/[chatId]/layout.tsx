import { InfoView } from "@/components/info-view";
import { getSession } from "@/lib/auth-server";
import { HydrateClient, trpcServer } from "@/server/server";
import { redirect } from "next/navigation";

export default async function ChatLayout(props: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) throw redirect(`/`);

  await trpcServer.chat.list.prefetch();

  return (
    <HydrateClient>
      <div className="p-4 pt-6 flex gap-4 h-screen">
        <div className="w-96 border-r pr-4">
          <InfoView session={session} />
        </div>
        {props.children}
      </div>
    </HydrateClient>
  );
}
