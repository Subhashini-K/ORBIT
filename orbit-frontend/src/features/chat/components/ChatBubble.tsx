import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/store/AuthContext";
import type { ChatMessage } from "../types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { user } = useAuth();
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-end gap-2.5", isAssistant ? "justify-start" : "justify-end")}
    >
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-orbit shadow-glow-blue">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}

      <div className={cn("flex max-w-[78%] flex-col gap-1", isAssistant ? "items-start" : "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
            isAssistant
              ? "glass rounded-bl-sm text-slate-200"
              : "rounded-br-sm bg-gradient-orbit text-white shadow-glow-purple"
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-[10.5px] text-slate-500">{formatTime(message.timestamp)}</span>
      </div>

      {!isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-[11px]">{user ? initials(user.name) : "You"}</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
