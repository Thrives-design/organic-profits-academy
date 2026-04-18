// Vercel serverless entry point.
// Vercel's Node.js runtime accepts an Express app (or any (req, res) handler)
// as the default export. The vercel.json rewrite "/api/(.*)" -> "/api" routes
// all API requests through this function; Express sees the original path
// (e.g. /api/videos) and matches its routes normally.
import { createApp } from "../server/app";

const appPromise = createApp();

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
