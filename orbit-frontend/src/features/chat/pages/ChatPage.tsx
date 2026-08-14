import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useChatSession } from "../hooks/useChatSession";
import { ChatMessageBubble, TypingIndicator, ChatInput, ChatSuggestions } from "../components";

export default function ChatPage() {
  const location = useLocation();
  const prefill = (location.state as { prefill?: string } | null)?.prefill;
  const hasSentPrefill = useRef(false);

  const { messages, sendMessage, isReplying } = useChatSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  // If we arrived here from the Dashboard's AI Assistant panel with a
  // prefilled question, send it once automatically.
  useEffect(() => {
    if (prefill && !hasSentPrefill.current) {
      hasSentPrefill.current = true;
      sendMessage(prefill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isReplying]);

  const showSuggestions = messages.length === 1 && !isReplying;

  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-11.5rem)] max-w-3xl flex-col lg:h-[calc(100vh-8rem)]">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-orbit shadow-glow-blue">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-white">AI Chat</h1>
            <p className="text-xs text-muted-foreground">Mock conversation — no live retrieval or reasoning yet.</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto pb-4 pr-1">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}

          <AnimatePresence>{isReplying && <TypingIndicator key="typing" />}</AnimatePresence>

          {showSuggestions && (
            <div className="pt-2">
              <p className="mb-2.5 text-xs font-medium text-slate-500">Try asking</p>
              <ChatSuggestions onPick={sendMessage} />
            </div>
          )}
        </div>

        <div className="pt-2">
          <ChatInput onSend={sendMessage} disabled={isReplying} />
        </div>
      </div>
    </AppShell>
  );
}
