import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/context/SessionContext";
import { Button } from "@/components/ui/button";
import { Chat } from "./community/Chat";
import { Forum } from "./community/Forum";

export default function Community() {
  const { user } = useSession();
  const [tab, setTab] = useState("chat");

  if (!user?.isMember) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="serif text-4xl">The community is members-only</h1>
          <p className="mt-3 text-muted-foreground">Unlock the chat, forum, and daily live desk conversation.</p>
          <Link href="/pricing"><Button className="mt-6 bg-primary">Join for $1,100</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <p className="eyebrow mb-1">Private community</p>
              <h1 className="serif text-3xl tracking-tight">The desk & the room</h1>
            </div>
          </div>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="chat" data-testid="tab-chat">Chat</TabsTrigger>
              <TabsTrigger value="forum" data-testid="tab-forum">Forum</TabsTrigger>
            </TabsList>
            <TabsContent value="chat"><Chat /></TabsContent>
            <TabsContent value="forum"><Forum /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
