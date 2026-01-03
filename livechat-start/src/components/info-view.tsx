import { SignOutButton } from "@/components/auth";
import { ChatList } from "@/components/chat-list";
import { ModeToggle } from "@/components/theme";
import { useAssertedSession } from "@/lib/auth-client";

export const InfoView: React.FC = () => {
  const session = useAssertedSession();

  return (
    <div className="flex flex-col gap-2 w-full h-full">
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
  );
};
