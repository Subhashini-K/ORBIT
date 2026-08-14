import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/store/AuthContext";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const { user } = useAuth();
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}
    >
      {isUser ? (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="text-xs">{user ? initials(user.name) : "You"}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-orbit shadow-glow-blue">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}

      <div className={cn("flex max-w-[75%] flex-col gap-1", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
            isUser
              ? "rounded-br-sm bg-gradient-orbit text-white shadow-glow-blue"
              : "glass rounded-bl-sm text-slate-200"
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-[10px] text-slate-500">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}
