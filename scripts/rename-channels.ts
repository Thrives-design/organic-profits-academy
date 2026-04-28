import "dotenv/config";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import { users, chatMessages } from "@shared/schema";
import { eq } from "drizzle-orm";

/**
 * One-shot migration to align production data with the warm-light redesign:
 *  - Rename admin display name from "Admin" -> "OPA Founders"
 *  - Rename existing chat channel slugs to match the 11 real Telegram channels.
 *    For channels with no clean mapping, drop them so the UI stays clean.
 *
 * Safe to re-run.
 */

const RENAMES: Record<string, string> = {
  // direct semantic mappings
  crypto: "trade-ideas",
  forex: "trade-ideas",
  options: "trade-ideas",
  wins: "profits",
  setups: "trade-ideas",
  "ask-the-pros": "organic-conversations",
};

const KEEP = new Set([
  "general",
  "trade-ideas",
  "profits",
  "digital-downloads",
  "organic-conversations",
  "tips-tricks",
  "credit-building",
  "opa-events",
  "backtesting",
  "webinar-feedback",
  "crypto-investing",
]);

async function main() {
  console.log("Renaming admin display name…");
  const updated = await db
    .update(users)
    .set({ name: "OPA Founders" })
    .where(eq(users.email, "admin@organicprofits.com"))
    .returning();
  console.log(`  admin rows updated: ${updated.length}`);

  console.log("Renaming chat channels…");
  for (const [oldSlug, newSlug] of Object.entries(RENAMES)) {
    const r = await db.execute(
      sql`UPDATE chat_messages SET channel = ${newSlug} WHERE channel = ${oldSlug}`,
    );
    console.log(`  ${oldSlug} -> ${newSlug}: ${r.rowCount ?? 0} rows`);
  }

  // Distinct channels left
  const distinct = await db.execute(
    sql`SELECT DISTINCT channel FROM chat_messages ORDER BY channel`,
  );
  const rows = (distinct.rows as Array<{ channel: string }>) ?? [];
  console.log("Channels now in chat_messages:");
  for (const r of rows) console.log("  -", r.channel);

  // Drop any channel not in the canonical KEEP set (safety net)
  for (const r of rows) {
    if (!KEEP.has(r.channel)) {
      const d = await db.execute(
        sql`DELETE FROM chat_messages WHERE channel = ${r.channel}`,
      );
      console.log(`  pruned ${r.channel}: ${d.rowCount ?? 0} rows`);
    }
  }

  // Seed empty real channels with one welcome message each so the UI looks alive
  const total = await db.select().from(chatMessages);
  const existingByChannel = new Set(total.map((m) => m.channel));
  const adminRow = (
    await db.select().from(users).where(eq(users.email, "admin@organicprofits.com"))
  )[0];
  if (adminRow) {
    const welcomes: Record<string, string> = {
      "digital-downloads": "Pinned: workbook + risk-management template are live. Grab them anytime.",
      "credit-building": "If you're working on credit, share your score milestones here. We celebrate every win.",
      "opa-events": "House events go here first. Houston-local + virtual.",
      backtesting: "Drop your journals + backtests. Iron sharpens iron.",
      "webinar-feedback": "After every webinar, share the parts that clicked + the questions you still have.",
      "crypto-investing": "Long-term plays + on-chain reads. Different vibe than #trade-ideas.",
      "tips-tricks": "Bite-size lessons that compound.",
      "organic-conversations": "The human side of trading. Mindset, life, accountability.",
    };
    for (const ch of Object.keys(welcomes)) {
      if (!existingByChannel.has(ch)) {
        await db.insert(chatMessages).values({
          channel: ch,
          userId: adminRow.id,
          userName: "BillionairePrice",
          body: welcomes[ch],
          createdAt: new Date(),
        });
        console.log(`  seeded welcome for #${ch}`);
      }
    }
  }

  console.log("Migration complete.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  });
