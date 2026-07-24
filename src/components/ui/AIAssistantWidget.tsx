"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Bot,
  Volume2,
  VolumeX,
} from "lucide-react";
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

/**
 * Web Audio API notification chime generator.
 */
function playNotificationSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Double note chime (D5 -> A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch {
    // Ignore audio context autoplay restriction errors
  }
}

/**
 * Lightweight Markdown & Link Parser for clean formatted text rendering.
 */
function parseFormattedMarkdown(text: string) {
  const lines = text.split("\n");

  return lines.map((line, lineIdx) => {
    if (!line.trim()) return <div key={lineIdx} className="h-2" />;

    const tokenRegex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = line.split(tokenRegex);

    const renderedParts = parts.map((part, partIdx) => {
      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (match) {
          const [, label, url] = match;
          const isExternal = /^https?:\/\//.test(url);
          if (isExternal) {
            return (
              <a
                key={partIdx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 inline-flex items-center gap-0.5 transition-colors"
              >
                {label}
                <ArrowUpRight className="size-3 inline shrink-0" />
              </a>
            );
          }
          return (
            <Link
              key={partIdx}
              href={url}
              className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 transition-colors"
            >
              {label}
            </Link>
          );
        }
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={partIdx} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={partIdx}
            className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-blue-700 border border-blue-200/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={partIdx}>{part}</span>;
    });

    return (
      <p key={lineIdx} className="mb-1.5 last:mb-0">
        {renderedParts}
      </p>
    );
  });
}

function ActionCardDisplay({ card }: { card: ActionCardData }) {
  const isExternal = /^https?:\/\//.test(card.url);

  const getIcon = () => {
    switch (card.type) {
      case "meeting":
        return <Calendar className="size-4 text-blue-600" />;
      case "report":
        return <FileText className="size-4 text-blue-600" />;
      case "video":
        return <Video className="size-4 text-blue-600" />;
      case "campaign":
        return <Briefcase className="size-4 text-blue-600" />;
      case "creator_team":
        return <Users className="size-4 text-blue-600" />;
      case "handoff":
        return <UserCheck className="size-4 text-blue-600" />;
      default:
        return <Sparkles className="size-4 text-blue-600" />;
    }
  };

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 rounded-2xl space-y-2.5 text-slate-900 shadow-sm transition-all hover:border-blue-200">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <h4 className="font-heading text-xs font-bold leading-snug">{card.title}</h4>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">{card.description}</p>

      <div className="pt-1">
        {isExternal ? (
          <a
            href={card.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all w-full sm:w-auto"
          >
            <span>{card.buttonText}</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        ) : (
          <Link
            href={card.url}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all w-full sm:w-auto"
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
    <div className="mt-3 p-3.5 bg-blue-50/60 border border-blue-200/80 rounded-2xl space-y-3 shadow-xs">
      <div className="flex items-center gap-2">
        <UserCheck className="size-4 text-blue-600 shrink-0" />
        <h4 className="font-heading text-xs font-bold text-slate-900">Human Contact & Collaboration</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Link
          href="/contact?vertical=brand"
          className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-2"
        >
          <Briefcase className="size-3.5 text-blue-600 shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-slate-900 block">Campaign Proposal</span>
            <span className="text-[9px] text-slate-500 block">Brand deals & UGC</span>
          </div>
        </Link>

        <Link
          href="/join-creator-team"
          className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-left hover:border-blue-500 hover:shadow-xs transition-all flex items-center gap-2"
        >
          <Users className="size-3.5 text-blue-600 shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-slate-900 block">Join Creator Team</span>
            <span className="text-[9px] text-slate-500 block">Editors & Videographers</span>
          </div>
        </Link>
      </div>

      <div className="pt-1 flex justify-between items-center border-t border-blue-200/60 text-[11px]">
        <a
          href="mailto:editsbymks@gmail.com"
          className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:underline"
        >
          <Mail className="size-3.5" />
          <span>editsbymks@gmail.com</span>
        </a>
      </div>
    </div>
  );
}

export function AIAssistantWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPromptToast, setShowPromptToast] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am Aero, Meet Shah's official AI Concierge. Ask me about Meet's creator journey, Fitness and Finance content, UGC packages, published analytics reports, or booking a meeting.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when chat modal is open to ensure scroll events stay in chat box
  useBodyScrollLock(isOpen);

  // Sound chime notification on first user interaction with website
  useEffect(() => {
    if (hasInteracted) return;

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setShowPromptToast(true);
        if (soundEnabled) {
          playNotificationSound();
        }
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [hasInteracted, soundEnabled]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

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

    if (soundEnabled) {
      playNotificationSound();
    }

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
        if (soundEnabled) {
          playNotificationSound();
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Aero is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
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
          content: "Aero is temporarily unavailable. You can still use the meeting, collaboration and creator-team links.",
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
      {/* Toast Prompt Notification */}
      {!isOpen && showPromptToast && (
        <div
          className="fixed z-[1099] animate-bounce max-w-[280px] sm:max-w-[320px] bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-start gap-3 transition-all"
          style={{
            right: "max(1.25rem, env(safe-area-inset-right))",
            bottom: "max(5rem, env(safe-area-inset-bottom))",
          }}
        >
          <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white mt-0.5">
            <Bot className="size-4" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-white leading-tight">👋 Hi! I&apos;m Aero</p>
            <p className="text-[11px] text-slate-300 mt-1 leading-normal">
              Meet Shah&apos;s AI Assistant is here to help you with content, booking & proposals!
            </p>
            <button
              onClick={() => {
                setShowPromptToast(false);
                setIsOpen(true);
                if (soundEnabled) playNotificationSound();
              }}
              className="mt-2 text-[10px] font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 block"
            >
              Ask Aero Anything →
            </button>
          </div>
          <button
            onClick={() => setShowPromptToast(false)}
            className="text-slate-400 hover:text-white p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          ref={buttonRef}
          onClick={() => {
            setIsOpen(true);
            setShowPromptToast(false);
            if (soundEnabled) playNotificationSound();
          }}
          className="fixed z-[1100] size-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/25 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group border border-white/20"
          style={{
            right: "max(1.25rem, env(safe-area-inset-right))",
            bottom: "max(1.25rem, env(safe-area-inset-bottom))",
          }}
          aria-label="Ask Aero AI Concierge"
        >
          <MessageSquare className="size-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-emerald-500 text-[9px] font-extrabold text-white rounded-full border-2 border-white shadow-xs tracking-wider">
            Aero
          </span>
        </button>
      )}

      {/* Aero AI Chat Panel Modal */}
      {isOpen && (
        <div
          onWheel={(e: React.WheelEvent) => e.stopPropagation()}
          onTouchMove={(e: React.TouchEvent) => e.stopPropagation()}
          className="
            fixed z-[1150] border border-slate-200/90 bg-white shadow-2xl
            flex flex-col overflow-hidden transition-all duration-300
            inset-x-0 bottom-0 h-[88dvh] rounded-t-3xl pb-[env(safe-area-inset-bottom)]
            sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[430px] sm:h-[600px] sm:max-h-[85vh] sm:rounded-3xl sm:pb-0
          "
        >
          {/* Header */}
          <div className="shrink-0 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-4 border-b border-slate-800 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-sm font-bold tracking-tight text-white block leading-tight">
                    Aero — Meet Shah AI
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                  Official Creator Concierge
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title={soundEnabled ? "Mute sound" : "Enable sound"}
                aria-label="Toggle notification sound"
              >
                {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                aria-label="Close Concierge"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages window — Strict event containment & custom visible scrollbar */}
          <div
            ref={scrollRef}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="
              flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 bg-slate-50/60 text-slate-800
              scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-transparent
            "
            style={{
              maxHeight: "100%",
              touchAction: "pan-y",
            }}
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
                      p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[88%] shadow-xs
                      ${
                        isUser
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-xs shadow-md shadow-blue-500/15"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"
                      }
                    `}
                  >
                    {parseFormattedMarkdown(m.content)}
                  </div>

                  {m.card && <ActionCardDisplay card={m.card} />}
                  {m.card?.type === "handoff" && <HumanHandoffCard />}
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-center gap-2 p-3 bg-white border border-slate-200/80 rounded-2xl max-w-[230px] text-xs text-slate-500 shadow-xs">
                <Loader2 className="size-4 animate-spin text-blue-600" />
                <span className="font-medium">Aero is thinking...</span>
              </div>
            )}
          </div>

          {/* Suggested Starter Questions */}
          {messages.length === 1 && (
            <div className="shrink-0 p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto scrollbar-none">
              {STARTER_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="shrink-0 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200/80 border border-slate-200/60 rounded-full px-3 py-1.5 text-[11px] font-medium text-slate-700 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="shrink-0 p-3 bg-white border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="bg-slate-100/80 border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 rounded-2xl p-1.5 flex items-center gap-2 transition-all"
            >
              <input
                type="text"
                placeholder="Ask Aero about fitness, finance, UGC or booking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-xs focus:outline-none text-slate-800 placeholder:text-slate-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:hover:from-blue-600 disabled:hover:to-blue-700 text-white shrink-0 size-9 rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-500/20"
                aria-label="Send message to Aero"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
