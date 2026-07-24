"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
  Calendar,
  FileText,
  Video,
  Briefcase,
  Users,
  Mail,
  ArrowUpRight,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useBodyScrollLock } from "@/lib/hooks/useBodyScrollLock";

export interface ActionCardData {
  type: "video" | "report" | "page" | "meeting" | "campaign" | "creator_team" | "handoff";
  title: string;
  description: string;
  buttonText: string;
  url: string;
}

export type Message = {
  role: "user" | "assistant";
  content: string;
  card?: ActionCardData;
};

const STARTER_QUESTIONS = [
  "What content does Meet create?",
  "Tell me about Meet's creator journey.",
  "Show me his Finance content.",
  "Show me his Fitness channel.",
  "How can I collaborate with Meet?",
  "Can I book a meeting?",
  "Show me the latest analytics reports.",
  "How do I join the creator team?",
];

function ActionCardDisplay({ card }: { card: ActionCardData }) {
  const isExternal = /^https?:\/\//.test(card.url);

  const getIcon = () => {
    switch (card.type) {
      case "meeting":
        return <Calendar className="size-4 text-blue" />;
      case "report":
        return <FileText className="size-4 text-blue" />;
      case "video":
        return <Video className="size-4 text-blue" />;
      case "campaign":
        return <Briefcase className="size-4 text-blue" />;
      case "creator_team":
        return <Users className="size-4 text-blue" />;
      case "handoff":
        return <UserCheck className="size-4 text-blue" />;
      default:
        return <Sparkles className="size-4 text-blue" />;
    }
  };

  return (
    <div className="mt-2.5 p-3.5 bg-surface-soft border border-border rounded-xl space-y-2 text-ink shadow-xs">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-blue-pale text-blue flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <h4 className="font-heading text-xs font-bold leading-snug">{card.title}</h4>
      </div>

      <p className="text-[11px] text-body leading-relaxed">{card.description}</p>

      <div className="pt-1">
        {isExternal ? (
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-blue px-4 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-blue-deep transition-colors w-full sm:w-auto"
          >
            <span>{card.buttonText}</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        ) : (
          <Link
            href={card.url}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-blue px-4 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-blue-deep transition-colors w-full sm:w-auto"
          >
            <span>{card.buttonText}</span>
            <ArrowUpRight className="size-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

function HumanHandoffCard() {
  return (
    <div className="mt-3 p-3.5 bg-blue/5 border border-blue/20 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <UserCheck className="size-4 text-blue shrink-0" />
        <h4 className="font-heading text-xs font-bold text-ink">Human Contact & Collaboration Options</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link
          href="/contact?vertical=brand"
          className="p-2.5 bg-white border border-border rounded-lg text-left hover:border-blue transition-colors flex items-center gap-2"
        >
          <Briefcase className="size-3.5 text-blue shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-ink block">Campaign Proposal</span>
            <span className="text-[9px] text-muted block">Brand deals & UGC</span>
          </div>
        </Link>

        <Link
          href="/join-creator-team"
          className="p-2.5 bg-white border border-border rounded-lg text-left hover:border-blue transition-colors flex items-center gap-2"
        >
          <Users className="size-3.5 text-blue shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-ink block">Join Creator Team</span>
            <span className="text-[9px] text-muted block">Editors & Videographers</span>
          </div>
        </Link>
      </div>

      <div className="pt-1 flex justify-between items-center border-t border-blue/10 text-[10px]">
        <a
          href="mailto:editsbymks@gmail.com"
          className="inline-flex items-center gap-1.5 font-bold text-blue hover:underline"
        >
          <Mail className="size-3" />
          <span>editsbymks@gmail.com</span>
        </a>
      </div>
    </div>
  );
}

export function AIAssistantWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Meet Shah's official AI Concierge. Ask me about Meet's creator journey, Fitness and Finance content, UGC packages, published analytics reports, or booking a meeting.",
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
      const res = await fetch("/api/assistant/chat", {
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
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.text,
            card: data.card,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "The AI assistant is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
            card: {
              type: "handoff",
              title: "Contact Options",
              description: "Direct links to Meet's booking page, proposal form, and email.",
              buttonText: "Submit Proposal",
              url: "/contact",
            },
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "The AI assistant is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
          card: {
            type: "handoff",
            title: "Contact Options",
            description: "Direct links to Meet's booking page, proposal form, and email.",
            buttonText: "Submit Proposal",
            url: "/contact",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (pathname.startsWith("/admin") || pathname.startsWith("/analytics/admin")) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          className="fixed z-[1100] size-14 rounded-full bg-blue hover:bg-blue-deep text-white shadow-lift flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-blue-light/10"
          style={{
            right: "max(1rem, env(safe-area-inset-right))",
            bottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
          aria-label="Ask Meet AI Concierge"
        >
          <MessageSquare className="size-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1 -right-1 size-4 bg-danger rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-bold">
            AI
          </span>
        </button>
      )}

      {isOpen && (
        <Card
          className="
            fixed z-[1150] border border-border bg-white shadow-soft
            flex flex-col overflow-hidden transition-all duration-300
            inset-x-0 bottom-0 h-[85dvh] rounded-t-panel pb-[env(safe-area-inset-bottom)]
            sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:h-[580px] sm:max-h-[82vh] sm:rounded-panel sm:pb-0
          "
        >
          {/* Header */}
          <div className="bg-surface-blue p-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2 text-blue">
              <Sparkles className="size-4 text-blue animate-pulse" />
              <div>
                <span className="font-heading text-xs font-bold text-ink block leading-none">
                  Meet Shah AI Concierge
                </span>
                <span className="text-[9px] text-muted block mt-1 font-semibold uppercase tracking-wider">
                  Official Creator Assistant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="size-8 rounded-full border border-border flex items-center justify-center text-ink hover:bg-surface-soft transition-colors"
              aria-label="Close Concierge"
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
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`
                      p-3.5 rounded-xl text-xs leading-relaxed max-w-[88%]
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

                  {m.card && <ActionCardDisplay card={m.card} />}
                  {m.card?.type === "handoff" && <HumanHandoffCard />}
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-center gap-2 p-2.5 bg-white border border-border rounded-lg max-w-[220px] text-xs text-muted shadow-xs">
                <Loader2 className="size-3.5 animate-spin text-blue" />
                <span>Checking verified knowledge...</span>
              </div>
            )}
          </div>

          {/* Suggested Starter Questions */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-border flex gap-2 overflow-x-auto scrollbar-none">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="shrink-0 bg-surface-soft hover:bg-blue-pale/40 border border-border rounded-full px-3 py-1.5 text-[10px] font-semibold text-body transition-colors"
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
              placeholder="Ask about fitness, finance, UGC or book a meeting..."
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
