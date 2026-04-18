import "dotenv/config";
import { createApp, log } from "./app";
import { serveStatic } from "./static";
import { createServer } from "http";

(async () => {
  const app = await createApp();
  const httpServer = createServer(app);

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
