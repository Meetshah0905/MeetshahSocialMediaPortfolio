"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What was the latest Instagram Fitness reach?",
  "How did YouTube subscribers change in June?",
  "Compare the last two Fitness and Finance reports.",
  "What is the male-to-female audience split in Finance?",
];

/**
 * "Ask Meet Analytics" — mounted ONCE in the root layout (§13). Hidden on
 * admin routes; the public chatbot has no business inside the admin shell.
 */
export function AIAssistantWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Ask me anything about Meet Shah's verified platform follower counts, weekly reach, demographic splits, or top-performing videos.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Below the sm breakpoint the chat panel behaves as a bottom sheet and the
  // background must not scroll under it. Above sm it's a floating card and
  // the page stays interactive, so no lock.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useBodyScrollLock(isOpen && isMobile);

  // Close on route change so we don't strand an open panel over the new page.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (isOpen) setIsOpen(false);
  }

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/analytics/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I encountered an error. Please try again later." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Failed to reach chatbot engine." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Public assistant only — never rendered inside the admin shell (§13).
  if (pathname.startsWith("/admin") || pathname.startsWith("/analytics/admin")) {
    return null;
  }

  return (
    <>
      {/* Launcher — floats above content but respects iOS home-indicator. */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="fixed z-50 size-14 rounded-full bg-blue hover:bg-blue-deep text-white shadow-lift flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-blue-light/10"
          style={{
            right: "max(1.5rem, env(safe-area-inset-right))",
            bottom: "max(1.5rem, env(safe-area-inset-bottom))",
          }}
          aria-label="Open Analytics Assistant"
        >
          <MessageSquare className="size-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 size-4 bg-danger rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-bold">
            AI
          </span>
        </button>
      )}

      {/* Full-screen bottom sheet on mobile, floating card on sm+ */}
      {isOpen && (
        <Card
          className="
            fixed z-50 border border-border bg-white shadow-soft
            flex flex-col overflow-hidden transition-all duration-300
            inset-x-0 bottom-0 h-[85dvh] rounded-t-panel pb-[env(safe-area-inset-bottom)]
            sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[550px] sm:max-h-[80vh] sm:rounded-panel sm:pb-0
          "
        >
          {/* Header */}
          <div className="bg-surface-blue p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-blue">
              <Sparkles className="size-4 text-blue animate-pulse" />
              <div>
                <span className="font-heading text-xs font-bold text-ink block leading-none">
                  Analytics Assistant
                </span>
                <span className="text-[9px] text-muted block mt-1 font-semibold uppercase tracking-wider">
                  Verified Data Source
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="size-8 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-soft transition-colors"
              aria-label="Close Assistant"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages window */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-soft/40 scrollbar-none"
          >
            {messages.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-start`}
                >
                  <div
                    className={`
                      p-3.5 rounded-lg text-xs leading-relaxed max-w-[85%]
                      ${
                        isUser
                          ? "bg-blue text-white shadow-xs"
                          : "bg-white text-ink border border-border shadow-xs"
                      }
                    `}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-center gap-2 p-2.5 bg-white border border-border rounded-lg max-w-[200px] text-xs text-muted shadow-xs">
                <Loader2 className="size-3.5 animate-spin text-blue" />
                <span>Reading archives...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Questions */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-border flex gap-2 overflow-x-auto scrollbar-none">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="shrink-0 bg-surface-soft hover:bg-blue-pale/35 border border-border rounded-full px-3 py-1.5 text-[9px] font-semibold text-body transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-border flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Ask about followers, reach, views..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-border px-3.5 py-2.5 rounded-lg text-base sm:text-xs bg-surface-soft focus:outline-none focus:border-blue text-ink"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-blue hover:bg-blue-deep text-white shrink-0 size-9 rounded-lg flex items-center justify-center p-0"
              aria-label="Send query"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
