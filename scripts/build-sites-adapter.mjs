import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const staticDir = resolve(root, "dist");
const adapterDir = resolve(root, "sites-dist");
const clientDir = resolve(adapterDir, "client");
const serverDir = resolve(adapterDir, "server");

await rm(adapterDir, { recursive: true, force: true });
await mkdir(clientDir, { recursive: true });
await mkdir(serverDir, { recursive: true });
await cp(staticDir, clientDir, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && !url.pathname.split('/').pop().includes('.')) {
      const pathname = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname + '/index.html';
      response = await env.ASSETS.fetch(new Request(new URL(pathname, url)));
    }
    return response;
  }
};\n`;
await writeFile(resolve(serverDir, "index.js"), worker, "utf8");
const hosting = JSON.parse(await readFile(resolve(root, ".openai", "hosting.json"), "utf8"));
await mkdir(resolve(adapterDir, ".openai"), { recursive: true });
await writeFile(resolve(adapterDir, ".openai", "hosting.json"), `${JSON.stringify(hosting, null, 2)}\n`, "utf8");
console.log(adapterDir);
