import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema, insertForumPostSchema, insertForumReplySchema,
  insertVideoSchema, insertProductSchema,
} from "@shared/schema";
import crypto from "crypto";

function genToken() {
  return crypto.randomBytes(32).toString("hex");
}

async function getUserFromReq(req: Request) {
  const auth = req.header("authorization");
  if (!auth) return null;
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const userId = await storage.getSessionUserId(token);
  if (!userId) return null;
  return (await storage.getUser(userId)) ?? null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  (async () => {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    (req as any).user = user;
    next();
  })().catch(next);
}

function requireMember(req: Request, res: Response, next: NextFunction) {
  (async () => {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (!user.isMember) return res.status(403).json({ error: "Members only" });
    (req as any).user = user;
    next();
  })().catch(next);
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  (async () => {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    if (!user.isAdmin) return res.status(403).json({ error: "Admin only" });
    (req as any).user = user;
    next();
  })().catch(next);
}

function publicUser(u: any) {
  if (!u) return null;
  const { password, ...rest } = u;
  return rest;
}

export async function registerRoutes(app: Express, httpServer?: Server): Promise<void> {
  app.use(express.json({ limit: "2mb" }));

  // ===== HEALTH =====
  app.get("/api/health", async (_req, res) => {
    try {
      await storage.listUsers();
      res.json({ ok: true, db: "connected" });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: e.message });
    }
  });

  // ===== AUTH =====
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByEmail(parsed.email);
      if (existing) return res.status(400).json({ error: "Email already registered" });
      const u = await storage.createUser(parsed);
      const token = genToken();
      await storage.createSession(token, u.id);
      res.json({ token, user: publicUser(u) });
    } catch (e: any) {
      res.status(400).json({ error: e.message || "Invalid signup" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body ?? {};
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });
      const u = await storage.getUserByEmail(email);
      if (!u || u.password !== password) return res.status(401).json({ error: "Invalid credentials" });
      const token = genToken();
      await storage.createSession(token, u.id);
      res.json({ token, user: publicUser(u) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const auth = req.header("authorization");
      if (auth) {
        const token = auth.replace(/^Bearer\s+/i, "").trim();
        if (token) await storage.deleteSession(token);
      }
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    const u = await getUserFromReq(req);
    if (!u) return res.status(401).json({ error: "Not authenticated" });
    const plan = await storage.getPaymentPlanByUser(u.id);
    res.json({ user: publicUser(u), plan });
  });

  // ===== MEMBERSHIP CHECKOUT =====
  app.post("/api/checkout/membership", async (req, res) => {
    try {
      const { name, email, password, planType } = req.body ?? {};
      if (!name || !email || !password || !planType) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const plans: Record<string, { installments: number; amount: number }> = {
        full: { installments: 1, amount: 1100 },
        "2mo": { installments: 2, amount: 550 },
        "3mo": { installments: 3, amount: 367 },
        "4mo": { installments: 4, amount: 275 },
      };
      const cfg = plans[planType];
      if (!cfg) return res.status(400).json({ error: "Invalid plan" });

      let user = await storage.getUserByEmail(email);
      if (user) {
        user = await storage.updateUser(user.id, { isMember: true, name });
      } else {
        user = await storage.createUser({ name, email, password } as any);
        user = await storage.updateUser(user!.id, { isMember: true });
      }
      const nextCharge = cfg.installments > 1 ? new Date(Date.now() + 30 * 86400000).toISOString() : null;
      await storage.createPaymentPlan({
        userId: user!.id,
        planType,
        totalAmount: 1100,
        installmentAmount: cfg.amount,
        totalInstallments: cfg.installments,
        paidInstallments: 1,
        nextChargeDate: nextCharge,
      } as any);

      await storage.createOrder({
        orderNumber: "OP-" + Date.now().toString(36).toUpperCase(),
        userId: user!.id,
        email,
        type: "membership",
        items: [{ name: "Lifetime Access", planType, amount: cfg.amount }] as any,
        subtotal: cfg.amount,
        shipping: null as any,
        status: "processing",
      } as any);

      const token = genToken();
      await storage.createSession(token, user!.id);
      res.json({ token, user: publicUser(user) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ===== VIDEOS =====
  app.get("/api/videos", async (_req, res) => {
    res.json(await storage.listVideos());
  });
  app.get("/api/videos/:id", async (req, res) => {
    const v = await storage.getVideo(Number(req.params.id));
    if (!v) return res.status(404).json({ error: "Not found" });
    res.json(v);
  });
  app.post("/api/videos", requireAdmin, async (req, res) => {
    try {
      const parsed = insertVideoSchema.parse(req.body);
      const v = await storage.createVideo(parsed);
      res.json(v);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });
  app.delete("/api/videos/:id", requireAdmin, async (req, res) => {
    await storage.deleteVideo(Number(req.params.id));
    res.json({ ok: true });
  });
  app.post("/api/videos/:id/complete", requireMember, async (req, res) => {
    const u = (req as any).user;
    const id = Number(req.params.id);
    await storage.upsertProgress(u.id, id, true);
    await storage.updateUser(u.id, { lastWatchedVideoId: id });
    res.json({ ok: true });
  });
  app.post("/api/videos/:id/view", requireMember, async (req, res) => {
    const u = (req as any).user;
    const id = Number(req.params.id);
    await storage.updateUser(u.id, { lastWatchedVideoId: id });
    res.json({ ok: true });
  });

  // ===== WEBINARS =====
  app.get("/api/webinars", async (_req, res) => {
    res.json(await storage.listWebinars());
  });

  // ===== CHAT =====
  app.get("/api/chat/:channel", requireMember, async (req, res) => {
    const { channel } = req.params;
    const since = Number(req.query.since ?? 0);
    const msgs = await storage.listChatMessages(channel, since);
    res.json(msgs);
  });
  app.post("/api/chat/:channel", requireMember, async (req, res) => {
    const { channel } = req.params;
    const u = (req as any).user;
    const { body } = req.body ?? {};
    if (!body?.trim()) return res.status(400).json({ error: "Empty message" });
    const m = await storage.createChatMessage({ channel, userId: u.id, userName: u.name, body: body.trim() });
    res.json(m);
  });

  // ===== FORUM =====
  app.get("/api/forum/posts", async (_req, res) => {
    res.json(await storage.listForumPosts());
  });
  app.get("/api/forum/posts/:id", async (req, res) => {
    const p = await storage.getForumPost(Number(req.params.id));
    if (!p) return res.status(404).json({ error: "Not found" });
    const replies = await storage.listForumReplies(p.id);
    res.json({ post: p, replies });
  });
  app.post("/api/forum/posts", requireMember, async (req, res) => {
    try {
      const u = (req as any).user;
      const data = { ...req.body, authorId: u.id, authorName: u.name };
      const parsed = insertForumPostSchema.parse(data);
      res.json(await storage.createForumPost(parsed));
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });
  app.post("/api/forum/posts/:id/upvote", requireAuth, async (req, res) => {
    res.json(await storage.upvotePost(Number(req.params.id)));
  });
  app.post("/api/forum/posts/:id/reply", requireMember, async (req, res) => {
    try {
      const u = (req as any).user;
      const data = { postId: Number(req.params.id), authorId: u.id, authorName: u.name, body: req.body.body };
      const parsed = insertForumReplySchema.parse(data);
      res.json(await storage.createForumReply(parsed));
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  // ===== PRODUCTS =====
  app.get("/api/products", async (_req, res) => {
    res.json(await storage.listProducts());
  });
  app.get("/api/products/:id", async (req, res) => {
    const p = await storage.getProduct(Number(req.params.id));
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  });
  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const parsed = insertProductSchema.parse(req.body);
      res.json(await storage.createProduct(parsed));
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  });

  // ===== ORDERS =====
  app.post("/api/checkout/merch", async (req, res) => {
    try {
      const { items, email, shipping, subtotal } = req.body ?? {};
      if (!items?.length || !email || !shipping) return res.status(400).json({ error: "Missing fields" });
      const u = await getUserFromReq(req);
      const order = await storage.createOrder({
        orderNumber: "OP-" + Date.now().toString(36).toUpperCase(),
        userId: u?.id ?? null,
        email,
        type: "merch",
        items: items as any,
        subtotal,
        shipping: shipping as any,
        status: "processing",
      } as any);
      res.json(order);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
  app.get("/api/orders", requireAdmin, async (_req, res) => {
    res.json(await storage.listOrders());
  });

  // ===== ADMIN =====
  app.get("/api/admin/members", requireAdmin, async (_req, res) => {
    const users = await storage.listUsers();
    const plans = await storage.listPaymentPlans();
    const merged = users.map((u: any) => ({
      ...publicUser(u),
      plan: plans.find((p: any) => p.userId === u.id) || null,
    }));
    res.json(merged);
  });
}
