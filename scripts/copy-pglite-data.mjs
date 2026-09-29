#!/usr/bin/env node
import { access, copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const library = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "_libs",
  "electric-sql__pglite.mjs",
);
const dist = join(root, "node_modules", "@electric-sql", "pglite", "dist");
const runtimeFiles = ["pglite.data", "pglite.wasm", "initdb.wasm"];

try {
  try {
    await access(library);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    console.log("[copy-pglite-data] PGlite is not bundled; no runtime assets needed.");
    process.exit(0);
  }
  const libDir = dirname(library);
  await mkdir(libDir, { recursive: true });
  await Promise.all(
    runtimeFiles.map(async (file) => {
      const source = join(dist, file);
      await access(source);
      await copyFile(source, join(libDir, file));
    }),
  );
  console.log("[copy-pglite-data] packaged PGlite runtime assets.");
} catch (error) {
  console.error(
    `[copy-pglite-data] failed to package PGlite runtime assets: ${error?.message || error}`,
  );
  process.exitCode = 1;
}
