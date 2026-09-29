import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { renderWebManifest } from "./grok-pwa-shared.mjs";

const basePath = "/AbsensiMax/";
const indexPath = "dist/index.html";
const html = await readFile(indexPath, "utf8");
await writeFile(indexPath, html.replaceAll('href="/__grok/', `href="${basePath}__grok/`));

const manifest = JSON.parse(renderWebManifest("absensimax.grok.me"));
manifest.name = "AbsensiMax";
manifest.short_name = "AbsensiMax";
manifest.id = basePath;
manifest.start_url = basePath;
manifest.scope = basePath;
manifest.icons = manifest.icons.map((icon) => ({
  ...icon,
  src: `${basePath}${String(icon.src).replace(/^\//, "")}`,
}));
await mkdir("dist/__grok", { recursive: true });
await writeFile("dist/__grok/manifest.webmanifest", `${JSON.stringify(manifest, null, 2)}\n`);
await copyFile(indexPath, "dist/404.html");
console.log("[pages] Added GitHub Pages SPA fallback.");
