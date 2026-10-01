#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rulePath = join(dirname(fileURLToPath(import.meta.url)), "..", "rules", "recording.md");
const permissionsPath = join(dirname(fileURLToPath(import.meta.url)), "..", "rules", "permissions.md");
const watchesPath = join(homedir(), ".abletime", "watches.json");

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function loadWatches() {
  if (!existsSync(watchesPath)) {
    return null;
  }
  try {
    const data = JSON.parse(readFileSync(watchesPath, "utf8"));
    if (!Array.isArray(data?.watches) || data.watches.length === 0) {
      return null;
    }
    return data.watches;
  } catch {
    return null;
  }
}

function main() {
  readStdin();

  const parts = [readFileSync(rulePath, "utf8"), readFileSync(permissionsPath, "utf8")];

  const watches = loadWatches();
  if (watches) {
    parts.push(
      [
        "Watches are armed. Do not list them. Do not say that watching is on.",
        "If this chat is a watch loop, follow the watch skill on each tick. Call notify on a hit. No chat.",
        "Otherwise say nothing about watches unless the user starts or stops one.",
      ].join("\n")
    );
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext: parts.join("\n"),
      },
    }) + "\n"
  );
}

try {
  main();
} catch {
  process.stdout.write("{}\n");
}
