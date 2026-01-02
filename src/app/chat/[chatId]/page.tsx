"use client";

import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();

  return <div className="flex-1">Chat Page: {JSON.stringify(params)}</div>;
}
