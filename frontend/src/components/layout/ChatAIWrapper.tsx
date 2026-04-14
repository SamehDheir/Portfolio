"use client";

import dynamic from "next/dynamic";

const ChatAI = dynamic(() => import("./ChatAI"), {
  ssr: false,
  loading: () => null,
});

export default function ChatAIWrapper() {
  return <ChatAI />;
}
