import { motion } from "framer-motion";
import { Mail, CalendarCheck, FolderSearch, StickyNote } from "lucide-react";

const SUGGESTIONS = [
  { icon: Mail, text: "Summarize my recent emails" },
  { icon: CalendarCheck, text: "What's on my calendar today?" },
  { icon: FolderSearch, text: "Find files related to Orbit project" },
  { icon: StickyNote, text: "Show my recent notes" },
];

export function ChatSuggestions({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {SUGGESTIONS.map(({ icon: Icon, text }, i) => (
        <motion.button
          key={text}
          type="button"
          onClick={() => onPick(text)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -2 }}
          className="focus-ring glass flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-[13px] text-slate-300 transition-colors hover:bg-white/[0.07] hover:text-white"
        >
          <Icon className="h-4 w-4 shrink-0 text-orbit-cyan" />
          {text}
        </motion.button>
      ))}
    </div>
  );
}
