import { useEffect, useRef, useState } from "react";
import { Hash, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useSession } from "@/context/SessionContext";

const CHANNELS = [
  { id: "general", label: "general" },
  { id: "crypto", label: "crypto" },
  { id: "futures", label: "futures" },
  { id: "options", label: "options" },
  { id: "forex", label: "forex" },
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
    <div className="grid grid-cols-12 gap-0 rounded-xl border border-card-border bg-card overflow-hidden h-[68vh]">
      <aside className="col-span-4 sm:col-span-3 border-r border-border bg-sidebar/50 overflow-y-auto py-3">
        <div className="px-4 eyebrow text-[10px] mb-2 text-foreground/60">Channels</div>
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            onClick={() => setChannel(c.id)}
            className={`flex w-full items-center gap-2 px-4 py-1.5 text-sm transition-colors ${channel === c.id ? "bg-accent/15 text-accent" : "text-foreground/80 hover:bg-accent/5"}`}
            data-testid={`channel-${c.id}`}
          >
            <Hash size={14} className="opacity-60" />
            <span className="truncate">{c.label}</span>
          </button>
        ))}
      </aside>
      <section className="col-span-8 sm:col-span-9 flex flex-col min-h-0">
        <header className="border-b border-border px-5 py-3 flex items-center gap-2 bg-background/50">
          <Hash size={15} className="text-accent" />
          <span className="font-medium text-sm">{channel}</span>
          <span className="text-xs text-muted-foreground ml-2">· {messages.length} messages</span>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((m, i) => {
            const prev = messages[i - 1];
            const sameAuthor = prev && prev.userName === m.userName && m.createdAt - prev.createdAt < 60000;
            return (
              <div key={m.id} className={`flex gap-3 ${sameAuthor ? "pt-0 -mt-2" : ""}`} data-testid={`message-${m.id}`}>
                {!sameAuthor ? (
                  <div className="h-8 w-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {initials(m.userName)}
                  </div>
                ) : <div className="w-8 shrink-0" />}
                <div className="flex-1 min-w-0">
                  {!sameAuthor && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-sm font-medium">{m.userName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">{m.body}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="border-t border-border p-3 flex gap-2" data-testid="form-chat">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message #${channel}`}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:border-accent"
            data-testid="input-chat-message"
          />
          <button type="submit" className="rounded-md bg-primary text-primary-foreground px-3 text-sm font-medium hover:opacity-90" data-testid="button-chat-send">
            <Send size={14} />
          </button>
        </form>
      </section>
    </div>
  );
}
