import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../server/db";
import { users } from "@shared/schema";

function looksHashed(pw: string | null | undefined): boolean {
  if (!pw) return false;
  return pw.startsWith("$2a$") || pw.startsWith("$2b$") || pw.startsWith("$2y$");
}

async function main() {
  const all = await db.select().from(users);
  console.log(`Scanning ${all.length} users...`);

  let hashedCount = 0;
  let skipCount = 0;

  for (const u of all) {
    if (looksHashed(u.password)) {
      skipCount++;
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 10);
    await db.update(users).set({ password: hashed }).where(eq(users.id, u.id));
    hashedCount++;
    console.log(`  hashed user id=${u.id} email=${u.email}`);
  }

  console.log(`Done. Hashed ${hashedCount}, already-hashed ${skipCount}.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  });
