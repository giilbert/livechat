"use client";

import { useRpc, useSession, useStore } from "@usemaf/react";
import { MafContext } from "@usemaf/react/src/maf-provider";
import { MafStatus } from "@usemaf/react/src/use-store";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface Message {
  name: string;
  content: string;
}

interface ChatStore {
  messages: Message[];
  live: Record<string, Message>;
}

export default function Home() {
  const [hasEdited, setHasEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("...");
  const chat = useStore<ChatStore>("chat");
  const send = useRpc<Message>("send");
  const liveUpdate = useRpc<Message>("live_update");
  const maf = useContext(MafContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  if (!maf) throw new Error("MafContext is not available");

  useEffect(() => {
    const onDisconnect = () => {
      maf.client.connect();
    };

    const unsubscribe = maf.client.on("close", onDisconnect);
    return () => {
      unsubscribe();
    };
  }, [maf.client]);

  useLayoutEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    } else {
      const NAMES = [
        "goose",
        "cow",
        "sheep",
        "pig",
        "chicken",
        "duck",
        "turkey",
        "donkey",
        "horse",
        "llama",
        "alpaca",
        "ostrich",
        "emu",
        "buffalo",
        "bison",
        "yak",
        "reindeer",
        "moose",
        "kangaroo",
        "wallaby",
      ];
      const randomName = `anonymous ${
        NAMES[Math.floor(Math.random() * NAMES.length)]
      }`;
      setName(randomName);
      localStorage.setItem("name", randomName);
    }

    setIsLoading(false);
  }, []);

  const numPreviews =
    chat.status === MafStatus.READY
      ? Object.entries(chat.data.live).filter(
          ([id, value]) =>
            id !== maf.client.sessionInfo.id && value.content.length > 0
        ).length
      : 0;
  const numRows =
    numPreviews +
    (chat.status === MafStatus.READY ? chat.data.messages.length : 0);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollTo({
        top: el.scrollHeight,
        // behavior: "smooth",
      });
    }
  }, [numRows]);

  const fitHeight = (el: HTMLTextAreaElement) => {
    const MAX_HEIGHT = 250;
    el.style.height = "0px";
    el.style.height = Math.min(MAX_HEIGHT, el.scrollHeight + 2) + "px";
  };

  return (
    <div className="flex justify-center px-8 pt-6 pb-2 h-screen">
      <div className="max-w-4xl w-full h-full flex flex-col gap-2">
        <Header />
        <div className="flex-1 overflow-y-auto" ref={containerRef}>
          {chat.status === MafStatus.READY &&
            chat.data.messages.map((msg, idx) => (
              <div key={idx} className="mb-2">
                <span className="font-bold">{msg.name}: </span>
                <pre>{msg.content}</pre>
              </div>
            ))}

          {chat.status === MafStatus.READY &&
            Object.entries(chat.data.live)
              .filter(([id]) => id !== maf.client.sessionInfo.id)
              .some(([, msg]) => msg.content.length > 0) && (
              <div className="my-3 border-t text-sm opacity-50" />
            )}

          {chat.status === MafStatus.READY &&
            Object.entries(chat.data.live).map(
              ([id, msg]) =>
                maf.client.sessionInfo.id !== id &&
                msg.content.length !== 0 && (
                  <div key={id} className="mb-2 opacity-50">
                    <span className="font-bold">{msg.name}: </span>
                    <pre>
                      {msg.content
                        .split("\n")
                        .slice(0, 5)
                        .join("")
                        .substring(0, 250)}
                    </pre>
                  </div>
                )
            )}

          {systemMessage && (
            <div className="my-2 p-2 bg-yellow-100 border border-yellow-300 rounded">
              <span className="font-bold">system: </span>
              <br />
              <pre>{systemMessage}</pre>
            </div>
          )}
        </div>
        <textarea
          placeholder={
            isLoading
              ? "loading..."
              : `chatting as \`${name}\`. type /help for commands.`
          }
          disabled={isLoading}
          className="border w-full resize-none outline-none p-2 h-auto min-h-20"
          rows={hasEdited ? undefined : 1}
          onInput={(e) => {
            setHasEdited(true);

            const text = e.currentTarget.value.trim();
            if (!text.startsWith("/"))
              liveUpdate.mutateAsync({ name, content: text });

            fitHeight(e.currentTarget);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const text = e.currentTarget.value.trim();

              if (text.length === 0) {
                return;
              }

              if (text.startsWith("/")) {
                const parts = text.slice(1).split(" ");
                const command = parts[0];
                const args = parts.slice(1);

                if (command === "help") {
                  setSystemMessage(
                    `available commands:
/help - show this help message
/name <new_name> - change your display name`
                  );
                } else if (command === "name") {
                  if (args.length === 0) {
                    setSystemMessage(`usage: /name <new_name>`);
                  } else {
                    const newName = args.join(" ");
                    setName(newName);
                    localStorage.setItem("name", newName);
                    setSystemMessage(
                      `your name has been changed to '${newName}'.`
                    );
                  }
                } else {
                  setSystemMessage(
                    `unknown command '${command}'. type /help for a list of commands.`
                  );
                }

                e.currentTarget.value = "";
                return;
              } else {
                setSystemMessage(null);
              }

              send.mutateAsync({ name, content: text });
              liveUpdate.mutateAsync({ name, content: "" });

              e.currentTarget.value = "";
              // send message
              fitHeight(e.currentTarget);
            }
          }}
        />
      </div>
    </div>
  );
}

const Header: React.FC = () => {
  const session = useSession();

  return (
    <div className="flex">
      <span className="font-bold">livechat</span>
      <span className="ml-auto">{session.status}</span>
    </div>
  );
};
