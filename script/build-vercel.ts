/**
 * Vercel build script.
 *
 *   1. Build the Vite client into dist/public (served as static files).
 *   2. Bundle the serverless API entry (server-vercel/entry.ts) into a single
 *      self-contained CJS file at api/index.js.
 *
 * Why bundle? Vercel's auto file-tracer occasionally misses TypeScript imports
 * in deeply-nested server modules and crashes at runtime with
 * `ERR_MODULE_NOT_FOUND`. Pre-bundling with esbuild guarantees every import
 * is resolved at build time and Vercel only has to load one .js file.
 *
 * The bundled file is committed to api/ as part of the build output. We
 * intentionally keep the source under server-vercel/ (not api/) so Vercel does
 * not try to compile the .ts file directly.
 */
import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { readFile, mkdir } from "fs/promises";

async function buildAll() {
  console.log("[vercel-build] step 1/2: building client (vite)...");
  await viteBuild();

  console.log("[vercel-build] step 2/2: bundling serverless function (esbuild)...");

  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const deps = Object.keys(pkg.dependencies || {});

  // Keep heavy / native-binding packages external so they're loaded from
  // node_modules at runtime instead of inlined into the bundle. Vercel will
  // still install them since they're in package.json dependencies.
  const keepExternal = new Set<string>([
    "@neondatabase/serverless",
    "ws",
    "stripe",
    "bcryptjs",
  ]);
  const externals = deps.filter((d) => keepExternal.has(d));

  await mkdir("api", { recursive: true });

  // Output as ESM (.mjs) — `package.json` has `"type": "module"`, so plain
  // `.js` files would be treated as ESM anyway. Using `.mjs` makes the
  // module type unambiguous regardless of package.json changes.
  await esbuild({
    entryPoints: ["server-vercel/entry.ts"],
    platform: "node",
    target: "node20",
    bundle: true,
    format: "esm",
    outfile: "api/index.mjs",
    define: { "process.env.NODE_ENV": '"production"' },
    external: externals,
    logLevel: "info",
    minify: false,
    // Several CommonJS deps may try to use require() inside an ESM bundle.
    // Inject a polyfill so those calls work.
    banner: {
      js: [
        "import { createRequire as __createRequire } from 'module';",
        "const require = __createRequire(import.meta.url);",
        "import { fileURLToPath as __fileURLToPath } from 'url';",
        "import { dirname as __dirname_fn } from 'path';",
        "const __filename = __fileURLToPath(import.meta.url);",
        "const __dirname = __dirname_fn(__filename);",
      ].join("\n"),
    },
  });

  console.log("[vercel-build] complete.");
}

buildAll().catch((err) => {
  console.error("[vercel-build] FAILED:", err);
  process.exit(1);
});
