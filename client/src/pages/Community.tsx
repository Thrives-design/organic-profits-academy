import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { useSession } from "@/context/SessionContext";
import { Chat } from "./community/Chat";
import { Forum } from "./community/Forum";

export default function Community() {
  const { user } = useSession();
  const [tab, setTab] = useState<"chat" | "forum">("chat");

  if (!user?.isMember) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-40 text-center">
          <p className="eyebrow mb-5">Private</p>
          <h1 className="serif text-4xl md:text-5xl font-normal leading-tight">
            The House is <span className="italic text-accent font-light">members-only</span>.
          </h1>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Unlock the chat, the forum, and the daily live desk conversation.
          </p>
          <Link href="/pricing">
            <a className="mt-10 inline-block bg-accent text-[hsl(var(--warm-black))] mono text-[11px] uppercase tracking-[0.22em] h-12 leading-[3rem] px-8 hover:bg-[hsl(var(--success))] hover:text-[hsl(var(--off-white))] transition-colors">
              Join for $1,100
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      {/* Header */}
      <section className="pt-10 pb-8 md:pt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p className="eyebrow mb-4">04 — The House</p>
              <h1 className="serif text-4xl md:text-5xl font-normal tracking-tight leading-[1]">
                Where the <span className="italic text-accent font-light">desk</span> meets the <span className="italic text-accent font-light">room</span>.
              </h1>
            </div>
            {/* Tabs — editorial text buttons, no pills */}
            <div className="flex items-center gap-8">
              {(["chat", "forum"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`mono text-[11px] uppercase tracking-[0.22em] pb-1 border-b transition-colors ${
                    tab === t
                      ? "text-accent border-accent"
                      : "text-muted-foreground/70 border-transparent hover:text-foreground"
                  }`}
                  data-testid={`tab-${t}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="hairline mt-6" />

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          {tab === "chat" ? <Chat /> : <Forum />}
        </div>
      </section>
    </Layout>
  );
}
