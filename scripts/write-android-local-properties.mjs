import { readFile, writeFile } from "node:fs/promises";

const config = JSON.parse(await readFile(".grok/app-env.json", "utf8"));
const values = {
  ABSENSIMAX_SUPABASE_URL: config.VITE_SUPABASE_URL,
  ABSENSIMAX_SUPABASE_ANON_KEY: config.VITE_SUPABASE_ANON_KEY,
};

for (const [key, value] of Object.entries(values)) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing public Supabase setting: ${key}`);
  }
}

const escapeProperty = (value) => value.replace(/[\\:=#]/g, "\\$&");
const contents = Object.entries(values)
  .map(([key, value]) => `${key}=${escapeProperty(value)}`)
  .join("\n");

await writeFile("android/local.properties", `${contents}\n`, { mode: 0o600 });
console.log("[android] Wrote local Supabase client settings to ignored local.properties.");
