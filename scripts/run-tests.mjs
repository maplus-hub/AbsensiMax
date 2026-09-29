#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

async function findScriptTests(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return findScriptTests(path);
      return entry.isFile() && entry.name.endsWith(".test.mjs") ? [path] : [];
    }),
  );
  return nested.flat().sort();
}

function run(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`[test] failed to start Node test runner: ${result.error.message}`);
    process.exit(1);
  }
  if (result.signal) {
    console.error(`[test] Node test runner exited on ${result.signal}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const scriptTests = await findScriptTests(join(root, "scripts"));
run(["--test", ...scriptTests]);
run([
  "--experimental-strip-types",
  "--test",
  "src/lib/app-data/app-data.test.ts",
  "src/lib/app-data/readiness-schedule.test.ts",
  "src/lib/auth/gate-identity.test.ts",
  "src/lib/auth/sign-in-gate.test.ts",
]);
