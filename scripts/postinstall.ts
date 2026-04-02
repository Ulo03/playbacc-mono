import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

// Bun sets INIT_CWD to the directory where `bun install` was invoked.
const root = process.env.INIT_CWD ?? process.cwd();

// Only install git hooks in a real git checkout.
if (!existsSync(join(root, ".git"))) process.exit(0);

// `bun install --production` doesn't install devDependencies, so lefthook may not exist.
const bin =
  (existsSync(join(root, "node_modules", ".bin", "lefthook")) &&
    join(root, "node_modules", ".bin", "lefthook")) ||
  (existsSync(join(root, "node_modules", ".bin", "lefthook.cmd")) &&
    join(root, "node_modules", ".bin", "lefthook.cmd"));

if (!bin) process.exit(0);

try {
  spawnSync(bin, ["install", "-f"], { cwd: root, stdio: "inherit" });
} catch {
  // never block installs on hook setup
}

process.exit(0);
