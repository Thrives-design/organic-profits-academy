import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useSession } from "@/context/SessionContext";

const CHANNELS = [
  { id: "general", label: "general" },
  { id: "crypto", label: "crypto" },
  { id: "forex", label: "forex" },
  { id: "options", label: "options" },
  { id: "wins", label: "wins" },
  { id: "setups", label: "setups" },
  { id: "ask-the-pros", label: "ask-the-pros" },
];

type Msg = { id: number; channel: string; userId: number; userName: string; body: string; createdAt: number };

export function Chat() {
  const { user } = useSession();
  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);

  useEffect(() => {
    setMessages([]);
    lastIdRef.current = 0;
    let active = true;
    async function poll() {
      try {
        const res = await apiRequest("GET", `/api/chat/${channel}?since=${lastIdRef.current}`);
        const data: Msg[] = await res.json();
        if (!active) return;
        if (data.length) {
          setMessages((prev) => [...prev, ...data]);
          lastIdRef.current = data[data.length - 1].id;
          requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
        }
      } catch {}
    }
    poll();
    const int = setInterval(poll, 2000);
    return () => { active = false; clearInterval(int); };
  }, [channel]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      await apiRequest("POST", `/api/chat/${channel}`, { body: draft.trim() });
      setDraft("");
    } catch {}
  }

  function initials(n: string) {
    return n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  return (
    <div className="grid grid-cols-12 gap-0 border border-border/60 bg-card overflow-hidden h-[72vh]" data-testid="chat-container">
      <aside className="col-span-4 sm:col-span-3 border-r border-border bg-sidebar/60 overflow-y-auto py-6">
        <div className="px-5 eyebrow text-[10px] mb-4 text-muted-foreground">The House — Channels</div>
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChannel(c.id)}
            className={`flex w-full items-center gap-2 px-5 py-2 text-sm transition-colors mono tracking-wider-editorial uppercase ${channel === c.id ? "text-accent" : "text-foreground/70 hover:text-accent"}`}
            data-testid={`channel-${c.id}`}
          >
            <span className="opacity-60">#</span>
            <span className="truncate">{c.label}</span>
            {channel === c.id && <span className="ml-auto h-px w-4 bg-accent" />}
          </button>
        ))}
      </aside>
      <section className="col-span-8 sm:col-span-9 flex flex-col min-h-0">
        <header className="hairline-bottom px-6 py-4 flex items-center gap-3 bg-background/40">
          <span className="eyebrow text-accent">#{channel}</span>
          <span className="text-xs text-muted-foreground ml-2">· {messages.length} messages</span>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const sameAuthor = prev && prev.userName === m.userName && m.createdAt - prev.createdAt < 60000;
            return (
              <div key={m.id} className={`flex gap-4 ${sameAuthor ? "pt-0 -mt-3" : ""}`} data-testid={`message-${m.id}`}>
                {!sameAuthor ? (
                  <div className="h-9 w-9 border border-accent/40 bg-accent/5 text-accent flex items-center justify-center text-[11px] font-medium mono shrink-0">
                    {initials(m.userName)}
                  </div>
                ) : <div className="w-9 shrink-0" />}
                <div className="flex-1 min-w-0">
                  {!sameAuthor && (
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-sm font-medium">{m.userName}</span>
                      <span className="eyebrow-subtle">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                  <p className="text-[15px] text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="hairline-top p-4 flex gap-2" data-testid="form-chat">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message #${channel}`}
            className="flex-1 border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            data-testid="input-chat-message"
          />
          <button type="submit" className="bg-primary text-primary-foreground px-4 text-sm font-medium hover:opacity-90 mono uppercase tracking-wider-editorial" data-testid="button-chat-send">
            <Send size={14} />
          </button>
        </form>
      </section>
    </div>
  );
}
