import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatMessage } from "../types";

interface ChatMessageListProps {
  messages: ChatMessage[];
  isSending: boolean;
}

export function ChatMessageList({ messages, isSending }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isSending]);

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-1 py-2">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isSending && <TypingIndicator key="typing" />}
      </AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}
