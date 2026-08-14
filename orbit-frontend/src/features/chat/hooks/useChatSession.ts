import { useCallback, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatApi";
import type { ChatMessage } from "../types";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "How can I help you today? Ask anything about your data, schedule, documents, memories or connect the dots for you.",
  timestamp: new Date().toISOString(),
};

/**
 * Owns the in-memory conversation for this session. No persistence, no
 * real backend — `sendChatMessage` is a mock. Structured so swapping in a
 * real streaming endpoint later only touches `api/chatApi.ts`.
 */
export function useChatSession() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const idCounter = useRef(0);

  function nextId() {
    idCounter.current += 1;
    return `msg_${idCounter.current}_${Date.now()}`;
  }

  const mutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(content),
  });

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      const userMessage: ChatMessage = {
        id: nextId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      mutation.mutate(trimmed, {
        onSuccess: (reply) => {
          setMessages((prev) => [
            ...prev,
            { id: nextId(), role: "assistant", content: reply, timestamp: new Date().toISOString() },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              id: nextId(),
              role: "assistant",
              content: "Something went wrong sending that. Please try again.",
              timestamp: new Date().toISOString(),
            },
          ]);
        },
      });
    },
    [mutation]
  );

  return {
    messages,
    sendMessage,
    isReplying: mutation.isPending,
  };
}
