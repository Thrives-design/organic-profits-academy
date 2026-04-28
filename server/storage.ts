import {
  users, videos, webinars, chatMessages, forumPosts, forumReplies, products, orders, paymentPlans, videoProgress, sessions,
  type User, type InsertUser, type Video, type InsertVideo, type Webinar, type InsertWebinar,
  type ChatMessage, type InsertChatMessage, type ForumPost, type InsertForumPost,
  type ForumReply, type InsertForumReply, type Product, type InsertProduct,
  type Order, type InsertOrder, type PaymentPlan, type InsertPaymentPlan,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gt, asc } from "drizzle-orm";

// Neon HTTP driver returns Promises of arrays. Take [0] for single row.
const first = <T>(arr: T[]): T | undefined => arr[0];

export const storage = {
  // ===== Users =====
  getUser: async (id: number): Promise<User | undefined> =>
    first(await db.select().from(users).where(eq(users.id, id))),
  getUserByEmail: async (email: string): Promise<User | undefined> =>
    first(await db.select().from(users).where(eq(users.email, email))),
  createUser: async (u: InsertUser & { isMember?: boolean; isAdmin?: boolean }): Promise<User> => {
    const rows = await db.insert(users).values({
      ...u,
      isMember: !!u.isMember,
      isAdmin: !!u.isAdmin,
    }).returning();
    return rows[0];
  },
  updateUser: async (id: number, patch: Partial<User>): Promise<User | undefined> => {
    const rows = await db.update(users).set(patch).where(eq(users.id, id)).returning();
    return rows[0];
  },
  listUsers: async (): Promise<User[]> =>
    await db.select().from(users).orderBy(desc(users.createdAt)),

  // ===== Payment plans =====
  createPaymentPlan: async (p: InsertPaymentPlan): Promise<PaymentPlan> => {
    const rows = await db.insert(paymentPlans).values(p).returning();
    return rows[0];
  },
  getPaymentPlanByUser: async (userId: number): Promise<PaymentPlan | undefined> =>
    first(await db.select().from(paymentPlans).where(eq(paymentPlans.userId, userId))),
  getPaymentPlanBySessionId: async (sessionId: string): Promise<PaymentPlan | undefined> =>
    first(await db.select().from(paymentPlans).where(eq(paymentPlans.stripeSessionId, sessionId))),
  getPaymentPlanBySubscriptionId: async (subId: string): Promise<PaymentPlan | undefined> =>
    first(await db.select().from(paymentPlans).where(eq(paymentPlans.stripeSubscriptionId, subId))),
  updatePaymentPlan: async (id: number, patch: Partial<PaymentPlan>): Promise<PaymentPlan | undefined> => {
    const rows = await db.update(paymentPlans).set(patch).where(eq(paymentPlans.id, id)).returning();
    return rows[0];
  },
  listPaymentPlans: async (): Promise<PaymentPlan[]> =>
    await db.select().from(paymentPlans),

  // ===== Videos =====
  listVideos: async (): Promise<Video[]> =>
    await db.select().from(videos).orderBy(desc(videos.createdAt)),
  getVideo: async (id: number): Promise<Video | undefined> =>
    first(await db.select().from(videos).where(eq(videos.id, id))),
  createVideo: async (v: InsertVideo): Promise<Video> => {
    const rows = await db.insert(videos).values(v).returning();
    return rows[0];
  },
  deleteVideo: async (id: number): Promise<void> => {
    await db.delete(videos).where(eq(videos.id, id));
  },

  // ===== Webinars =====
  listWebinars: async (): Promise<Webinar[]> =>
    await db.select().from(webinars),
  createWebinar: async (w: InsertWebinar): Promise<Webinar> => {
    const rows = await db.insert(webinars).values(w).returning();
    return rows[0];
  },

  // ===== Chat =====
  listChatMessages: async (channel: string, sinceId = 0): Promise<ChatMessage[]> => {
    return await db
      .select()
      .from(chatMessages)
      .where(and(eq(chatMessages.channel, channel), gt(chatMessages.id, sinceId)))
      .orderBy(asc(chatMessages.id));
  },
  createChatMessage: async (m: InsertChatMessage): Promise<ChatMessage> => {
    const rows = await db.insert(chatMessages).values(m).returning();
    return rows[0];
  },

  // ===== Forum =====
  listForumPosts: async (): Promise<ForumPost[]> =>
    await db.select().from(forumPosts).orderBy(desc(forumPosts.createdAt)),
  getForumPost: async (id: number): Promise<ForumPost | undefined> =>
    first(await db.select().from(forumPosts).where(eq(forumPosts.id, id))),
  createForumPost: async (p: InsertForumPost): Promise<ForumPost> => {
    const rows = await db.insert(forumPosts).values({ ...p, upvotes: 0 }).returning();
    return rows[0];
  },
  upvotePost: async (id: number): Promise<ForumPost | null> => {
    const p = first(await db.select().from(forumPosts).where(eq(forumPosts.id, id)));
    if (!p) return null;
    const rows = await db.update(forumPosts).set({ upvotes: p.upvotes + 1 }).where(eq(forumPosts.id, id)).returning();
    return rows[0] ?? null;
  },
  listForumReplies: async (postId: number): Promise<ForumReply[]> =>
    await db.select().from(forumReplies).where(eq(forumReplies.postId, postId)),
  createForumReply: async (r: InsertForumReply): Promise<ForumReply> => {
    const rows = await db.insert(forumReplies).values(r).returning();
    return rows[0];
  },

  // ===== Products =====
  listProducts: async (): Promise<Product[]> =>
    await db.select().from(products),
  getProduct: async (id: number): Promise<Product | undefined> =>
    first(await db.select().from(products).where(eq(products.id, id))),
  createProduct: async (p: InsertProduct): Promise<Product> => {
    const rows = await db.insert(products).values(p).returning();
    return rows[0];
  },
  updateProduct: async (id: number, patch: Partial<Product>): Promise<Product | undefined> => {
    const rows = await db.update(products).set(patch).where(eq(products.id, id)).returning();
    return rows[0];
  },

  // ===== Orders =====
  listOrders: async (): Promise<Order[]> =>
    await db.select().from(orders).orderBy(desc(orders.createdAt)),
  createOrder: async (o: InsertOrder): Promise<Order> => {
    const rows = await db.insert(orders).values(o).returning();
    return rows[0];
  },

  // ===== Video progress =====
  getProgress: async (userId: number, videoId: number) => {
    return first(
      await db
        .select()
        .from(videoProgress)
        .where(and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId)))
    );
  },
  upsertProgress: async (userId: number, videoId: number, completed: boolean) => {
    const existing = await storage.getProgress(userId, videoId);
    if (existing) {
      const rows = await db
        .update(videoProgress)
        .set({ completed, updatedAt: new Date() })
        .where(eq(videoProgress.id, existing.id))
        .returning();
      return rows[0];
    }
    const rows = await db
      .insert(videoProgress)
      .values({ userId, videoId, completed, lastPosition: 0 })
      .returning();
    return rows[0];
  },

  // ===== Sessions (Postgres-backed token store) =====
  createSession: async (token: string, userId: number): Promise<void> => {
    await db.insert(sessions).values({ token, userId });
  },
  getSessionUserId: async (token: string): Promise<number | null> => {
    const row = first(await db.select().from(sessions).where(eq(sessions.token, token)));
    return row?.userId ?? null;
  },
  deleteSession: async (token: string): Promise<void> => {
    await db.delete(sessions).where(eq(sessions.token, token));
  },
};
