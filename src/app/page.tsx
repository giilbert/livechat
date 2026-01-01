import { SignInButton, SignOutButton } from "@/components/auth";
import { getSession } from "@/lib/auth-server";

export default async function Home() {
  const session = await getSession();

  if (session) {
    console.log(session.user);
    return (
      <div>
        <p>hello {session.user.email}</p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="w-full flex p-4 flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-2">
        <p>a chat app for the slow typers and the impatient</p>
        <SignInButton />
      </div>
    </div>
  );
}
