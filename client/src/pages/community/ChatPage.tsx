import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { useSession } from "@/context/SessionContext";
import { Chat } from "./Chat";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
  const { user } = useSession();

  if (!user?.isMember && !user?.isAdmin) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <p className="eyebrow mb-5">Members only</p>
          <h1 className="serif text-4xl md:text-5xl" style={{ fontWeight: 400 }}>
            The in-app archive is <span className="italic">members-only</span>.
          </h1>
          <Link href="/pricing">
            <a className="mt-10 inline-block bg-primary text-primary-foreground mono text-[11px] uppercase tracking-widest-editorial h-12 leading-[3rem] px-8">
              Become a Member
            </a>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link href="/community" data-testid="link-back-to-community">
            <a className="inline-flex items-center gap-2 mono text-[11px] uppercase tracking-widest-editorial text-[hsl(var(--brand-brown))] hover:text-foreground">
              <ArrowLeft size={12} /> Community
            </a>
          </Link>
          <h1 className="serif text-3xl md:text-4xl mt-4" style={{ fontWeight: 400 }}>
            In-app <span className="italic">archive</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Older conversations. The live community is on Telegram.
          </p>
        </div>
      </section>
      <div className="hairline" />
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Chat />
        </div>
      </section>
    </Layout>
  );
}
