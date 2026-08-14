import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatApi";
import type { ChatMessage } from "../types";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "How can I help you today? Ask anything about your data, schedule, documents, or memories — I'll connect the dots for you.",
  timestamp: new Date().toISOString(),
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date().toISOString() };
}

/**
 * Owns the message list for a single chat session (in-memory only — no
 * persistence, no real backend). `sendMessage` appends the user's message
 * immediately, then appends the mocked assistant reply once it "arrives".
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);

  const mutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(content),
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    },
  });

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      setMessages((prev) => [...prev, createMessage("user", trimmed)]);
      mutation.mutate(trimmed);
    },
    [mutation]
  );

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, id: crypto.randomUUID(), timestamp: new Date().toISOString() }]);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isSending: mutation.isPending,
  };
}
