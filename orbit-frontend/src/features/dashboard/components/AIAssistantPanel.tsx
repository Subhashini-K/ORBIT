import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, CalendarCheck, FolderSearch, StickyNote, ArrowRight, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const SUGGESTIONS = [
  { icon: Mail, text: "Summarize my recent emails" },
  { icon: CalendarCheck, text: "What's on my calendar today?" },
  { icon: FolderSearch, text: "Find files related to Orbit project" },
  { icon: StickyNote, text: "Show my recent notes" },
];

/**
 * Mock AI Assistant surface. No LLM/retrieval logic — submitting or picking
 * a suggestion simply routes to the (also mocked) AI Chat page.
 */
export function AIAssistantPanel() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState("");

  function goToChat(prefill?: string) {
    navigate("/chat", prefill ? { state: { prefill } } : undefined);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    goToChat(draft.trim());
  }

  return (
    <Card className="flex flex-col p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-orbit-cyan" />
        <h2 className="font-display text-base font-semibold text-white">AI Assistant</h2>
      </div>

      <div className="glass rounded-xl p-4 text-sm leading-relaxed text-slate-300">
        How can I help you today? Ask anything about your data, schedule, documents, memories or connect the dots for you.
      </div>

      <div className="mt-4 space-y-2">
        {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
          <motion.button
            key={text}
            type="button"
            onClick={() => goToChat(text)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ x: 3 }}
            className="focus-ring group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-left text-[13px] text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <Icon className="h-4 w-4 shrink-0 text-orbit-cyan" />
            <span className="flex-1">{text}</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-400" />
          </motion.button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask Orbit anything..."
          className="focus-ring h-11 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-slate-500 transition-colors hover:border-white/20 focus-visible:border-primary/50"
        />
        <button
          type="submit"
          aria-label="Send"
          className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-orbit text-white shadow-glow-purple transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </Card>
  );
}
