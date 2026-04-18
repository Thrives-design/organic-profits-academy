import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  doublePrecision,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  isMember: boolean("is_member").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastWatchedVideoId: integer("last_watched_video_id"),
});

export const paymentPlans = pgTable("payment_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planType: text("plan_type").notNull(), // full, 2mo, 3mo, 4mo
  totalAmount: doublePrecision("total_amount").notNull(),
  installmentAmount: doublePrecision("installment_amount").notNull(),
  totalInstallments: integer("total_installments").notNull(),
  paidInstallments: integer("paid_installments").notNull().default(1),
  nextChargeDate: text("next_charge_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  niche: text("niche").notNull(), // crypto, futures, options, forex
  level: text("level").notNull(), // beginner, advanced
  duration: text("duration").notNull(), // "42:18"
  instructor: text("instructor").notNull(),
  videoUrl: text("video_url").notNull(),
  thumbnailColor: text("thumbnail_color").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const webinars = pgTable("webinars", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  niche: text("niche").notNull(),
  instructor: text("instructor").notNull(),
  scheduledAt: text("scheduled_at").notNull(), // ISO
  durationMin: integer("duration_min").notNull(),
  status: text("status").notNull().default("upcoming"),
  replayUrl: text("replay_url"),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  channel: text("channel").notNull(),
  userId: integer("user_id").notNull(),
  userName: text("user_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull(),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorId: integer("author_id").notNull(),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: doublePrecision("price").notNull(),
  description: text("description").notNull(),
  colors: jsonb("colors").notNull(), // string[]
  sizes: jsonb("sizes").notNull(),   // string[]
  baseColor: text("base_color").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id"),
  email: text("email").notNull(),
  type: text("type").notNull(),
  items: jsonb("items").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  shipping: jsonb("shipping"),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const videoProgress = pgTable("video_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  videoId: integer("video_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  lastPosition: integer("last_position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Session tokens — Postgres-backed replacement for in-memory Map
export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isAdmin: true,
  isMember: true,
  lastWatchedVideoId: true,
});
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true });
export const insertWebinarSchema = createInsertSchema(webinars).omit({ id: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export const insertForumPostSchema = createInsertSchema(forumPosts).omit({ id: true, createdAt: true, upvotes: true });
export const insertForumReplySchema = createInsertSchema(forumReplies).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertPaymentPlanSchema = createInsertSchema(paymentPlans).omit({ id: true, createdAt: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Webinar = typeof webinars.$inferSelect;
export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type PaymentPlan = typeof paymentPlans.$inferSelect;
export type InsertPaymentPlan = z.infer<typeof insertPaymentPlanSchema>;
export type VideoProgress = typeof videoProgress.$inferSelect;

export const NICHES = ["crypto", "futures", "options", "forex"] as const;
export type Niche = (typeof NICHES)[number];
