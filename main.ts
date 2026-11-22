// LAST CAR TO DAWN — the dossier program for "Make the best heist game".
// The entry is a browser game that lives under game/ in this repository.
// This program performs one job: after a preflight that proves the shipped
// page is whole, it assembles the static dossier the judges open — the game
// exactly as committed, beside the screenshots and notes. Nothing is
// generated at this stage; what was reviewed is what is served.

import { cpSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const root = fileURLToPath(new URL(".", import.meta.url));
const gameDir = join(root, "game");
const shotsDir = join(root, "screenshots");

// --- preflight: the entry must be complete before it may travel -----------
const required: Array<[string, number]> = [
  ["game/index.html", 200],
  ["game/src/main.js", 1500],
  ["game/src/sim.js", 6000],
  ["game/src/view.js", 3000],
  ["game/src/audio.js", 1200],
  ["game/src/config.js", 600],
  ["game/src/shots.js", 500],
  ["screenshots/cover.jpg", 8000],
  ["screenshots/near-miss.jpg", 8000],
  ["screenshots/dawn.jpg", 8000],
];
const failures: string[] = [];
for (const [rel, min] of required) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    failures.push(`missing ${rel}`);
  } else if (statSync(p).size < min) {
    failures.push(`${rel} is only ${statSync(p).size} bytes (expected at least ${min})`);
  }
}
const html = readFileSync(join(gameDir, "index.html"), "utf8");
if (!html.includes('src="./src/main.js"')) {
  failures.push("game/index.html does not load ./src/main.js");
}
const sim = readFileSync(join(gameDir, "src", "sim.js"), "utf8");
for (const marker of ["EVIDENCE", "radio", "wardrobe", "MANHUNT"]) {
  if (!sim.includes(marker)) failures.push(`sim.js is missing its ${marker} system`);
}
if (failures.length > 0) {
  console.error("LAST CAR TO DAWN preflight failed:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`preflight ok: ${required.length} files verified, all systems present`);

// --- assemble ---------------------------------------------------------------
// The grader mounts this repository read-only and hands us a writable
// /output (MAKEFUN_OUTPUT_DIR); never write beside the sources.
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(out, { recursive: true });
cpSync(gameDir, join(out, "game"), { recursive: true });
cpSync(shotsDir, join(out, "screenshots"), { recursive: true });
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
console.log("dossier assembled — the tram leaves at dawn.");
