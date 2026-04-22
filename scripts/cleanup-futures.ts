/**
 * One-time (idempotent) cleanup: remove all "futures" content from Neon.
 * Safe to re-run — simply finds 0 rows on subsequent runs.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx scripts/cleanup-futures.ts
 */
import "dotenv/config";
import { db } from "../server/db";
import { videos, webinars, chatMessages, forumPosts, forumReplies } from "@shared/schema";
import { eq, or, ilike, inArray } from "drizzle-orm";

async function main() {
  console.log("— cleanup-futures: scanning Neon —");

  // ----- COUNT BEFORE -----
  const videosFutures = await db.select().from(videos).where(eq(videos.niche, "futures"));
  const webinarsFutures = await db.select().from(webinars).where(eq(webinars.niche, "futures"));
  const chatFutures = await db.select().from(chatMessages).where(eq(chatMessages.channel, "futures"));

  const forumFutures = await db
    .select()
    .from(forumPosts)
    .where(
      or(
        ilike(forumPosts.title, "%futures%"),
        ilike(forumPosts.body, "%futures%"),
        ilike(forumPosts.category, "%futures%"),
      ),
    );
  const forumIds = forumFutures.map((p) => p.id);

  const forumRepliesFutures = forumIds.length
    ? await db.select().from(forumReplies).where(inArray(forumReplies.postId, forumIds))
    : [];

  console.log("BEFORE:");
  console.log(`  videos (niche='futures'):       ${videosFutures.length}`);
  console.log(`  webinars (niche='futures'):     ${webinarsFutures.length}`);
  console.log(`  chat messages (channel='futures'): ${chatFutures.length}`);
  console.log(`  forum posts matching futures:   ${forumFutures.length}`);
  console.log(`  forum replies to those posts:   ${forumRepliesFutures.length}`);

  // ----- DELETE -----
  if (forumIds.length) {
    await db.delete(forumReplies).where(inArray(forumReplies.postId, forumIds));
    await db.delete(forumPosts).where(inArray(forumPosts.id, forumIds));
  }
  await db.delete(chatMessages).where(eq(chatMessages.channel, "futures"));
  await db.delete(videos).where(eq(videos.niche, "futures"));
  await db.delete(webinars).where(eq(webinars.niche, "futures"));

  // ----- COUNT AFTER (verify 0) -----
  const after = {
    videos: (await db.select().from(videos).where(eq(videos.niche, "futures"))).length,
    webinars: (await db.select().from(webinars).where(eq(webinars.niche, "futures"))).length,
    chat: (await db.select().from(chatMessages).where(eq(chatMessages.channel, "futures"))).length,
    forum: (
      await db
        .select()
        .from(forumPosts)
        .where(
          or(
            ilike(forumPosts.title, "%futures%"),
            ilike(forumPosts.body, "%futures%"),
            ilike(forumPosts.category, "%futures%"),
          ),
        )
    ).length,
  };
  console.log("AFTER:");
  console.log(`  videos:   ${after.videos}`);
  console.log(`  webinars: ${after.webinars}`);
  console.log(`  chat:     ${after.chat}`);
  console.log(`  forum:    ${after.forum}`);

  // ----- Re-seed supplementary crypto/forex/options videos (idempotent by title) -----
  const SAMPLE_MP4 =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const supplementary = [
    { title: "Perps & Funding: A Trader's Field Guide", niche: "crypto", level: "advanced", duration: "36:55", instructor: "Sara Lin" },
    { title: "Reading Coinbase Premium & Spot CVD", niche: "crypto", level: "advanced", duration: "43:20", instructor: "Marcus Hale" },
    { title: "DXY Structure & The Dollar Cycle", niche: "forex", level: "advanced", duration: "40:18", instructor: "Kwame Adeyemi" },
    { title: "The Weekly Forex Bias Routine", niche: "forex", level: "beginner", duration: "24:36", instructor: "Isabel Moreno" },
    { title: "Vertical Spreads: A Complete Primer", niche: "options", level: "beginner", duration: "31:04", instructor: "Noah Bennett" },
    { title: "Gamma, Pin Risk & The Close", niche: "options", level: "advanced", duration: "45:09", instructor: "Priya Shah" },
  ];
  const existingTitles = new Set(
    (await db.select({ title: videos.title }).from(videos)).map((r) => r.title),
  );
  let inserted = 0;
  for (const v of supplementary) {
    if (existingTitles.has(v.title)) continue;
    await db.insert(videos).values({
      title: v.title,
      description: `A focused session covering ${v.title.toLowerCase()}. Expect live chart annotations, entry and exit criteria, and a runbook you can apply on Monday morning.`,
      niche: v.niche,
      level: v.level,
      duration: v.duration,
      instructor: v.instructor,
      videoUrl: SAMPLE_MP4,
      thumbnailColor: "#ae9b6c",
    });
    inserted++;
  }
  console.log(`Inserted ${inserted} new supplementary videos (idempotent).`);

  console.log("— cleanup-futures: done —");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("cleanup failed:", err);
    process.exit(1);
  });
