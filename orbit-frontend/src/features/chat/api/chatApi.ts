import { delay } from "@/lib/mockApi";

/**
 * Mock only — there is no LLM, retrieval, or Context Fusion Engine behind
 * this. Replies are static placeholder copy selected by a simple keyword
 * match, purely so the chat interface has believable-looking content to
 * render. Real reasoning is explicitly out of scope for Phase 1.
 */
interface CannedReply {
  keywords: string[];
  response: string;
}

const CANNED_REPLIES: CannedReply[] = [
  {
    keywords: ["email", "gmail", "inbox"],
    response:
      "This is a placeholder response. Once connected to your real inbox, Orbit will summarize the emails that actually matter here.",
  },
  {
    keywords: ["calendar", "meeting", "schedule", "today"],
    response:
      "This is a placeholder response. Your real calendar view — upcoming events, conflicts, and free time — will render here in a later phase.",
  },
  {
    keywords: ["file", "drive", "document"],
    response:
      "This is a placeholder response. File search across Google Drive isn't wired up yet — this is just a mock reply.",
  },
  {
    keywords: ["note"],
    response: "This is a placeholder response. Your recent notes will be summarized here once Notes is fully connected.",
  },
];

const DEFAULT_REPLY =
  "This is a placeholder response — Orbit's reasoning engine isn't connected in Phase 1. Once it is, this is where a real, source-grounded answer will appear.";

function pickReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const match = CANNED_REPLIES.find((r) => r.keywords.some((k) => lower.includes(k)));
  return match?.response ?? DEFAULT_REPLY;
}

/** Mock implementation of sending a chat message and getting a reply. */
export async function sendChatMessage(userMessage: string): Promise<string> {
  const reply = pickReply(userMessage);
  // Simulate "thinking" latency proportional to reply length, capped for UX.
  const latency = Math.min(1600, 500 + reply.length * 4);
  return delay(reply, latency);
}
