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

  if (!maf) throw new Error("MafContext is not available");

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
                <span>{msg.content}</span>
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
                    <span>{msg.content}</span>
                  </div>
                )
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
