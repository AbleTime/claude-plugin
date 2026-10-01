#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(relPath) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) {
    fail(`Missing file: ${relPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(abs, "utf8"));
  } catch (err) {
    fail(`Invalid JSON in ${relPath}: ${err.message}`);
    return null;
  }
}

function readText(relPath) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) {
    fail(`Missing file: ${relPath}`);
    return null;
  }
  return readFileSync(abs, "utf8");
}

const marketplace = readJson(".claude-plugin/marketplace.json");
if (marketplace) {
  if (marketplace.name !== "abletime") {
    fail(".claude-plugin/marketplace.json name must be abletime");
  }
  if (!marketplace.owner || marketplace.owner.name !== "AbleTime") {
    fail(".claude-plugin/marketplace.json owner.name must be AbleTime");
  }
  if (marketplace.owner && Object.prototype.hasOwnProperty.call(marketplace.owner, "email")) {
    fail(".claude-plugin/marketplace.json must not include owner.email");
  }
  const entry = Array.isArray(marketplace.plugins) ? marketplace.plugins[0] : null;
  if (!entry || entry.name !== "abletime" || entry.source !== "./plugins/abletime") {
    fail(".claude-plugin/marketplace.json must list abletime at ./plugins/abletime");
  }
}

const pluginRoot = "plugins/abletime";
const plugin = readJson(`${pluginRoot}/.claude-plugin/plugin.json`);
if (plugin) {
  for (const field of ["name", "license"]) {
    if (plugin[field] == null || plugin[field] === "") {
      fail(`${pluginRoot}/.claude-plugin/plugin.json missing required field: ${field}`);
    }
  }
  if (!plugin.author || typeof plugin.author !== "object" || !plugin.author.name) {
    fail(`${pluginRoot}/.claude-plugin/plugin.json missing required field: author.name`);
  }
  if (plugin.author && Object.prototype.hasOwnProperty.call(plugin.author, "email")) {
    fail(`${pluginRoot}/.claude-plugin/plugin.json must not include author.email`);
  }
}

const mcp = readJson(`${pluginRoot}/.mcp.json`);
const pluginsUrl = "https://track.abletime.com/api/public/v2/mcp/plugins";
if (mcp) {
  const raw = JSON.stringify(mcp);
  const servers = mcp.mcpServers || {};
  if (!raw.includes(pluginsUrl)) {
    fail(`.mcp.json missing live plugins URL: ${pluginsUrl}`);
  }
  if (Object.keys(servers).length !== 1) {
    fail(".mcp.json must declare exactly one MCP server: plugins");
  }
  if (!servers.plugins || servers.plugins.url !== pluginsUrl || servers.plugins.type !== "http") {
    fail(".mcp.json plugins must be type http and point at the live plugins URL");
  }
  if (/Authorization/i.test(raw)) {
    fail(".mcp.json must not contain Authorization");
  }
  if (/Bearer/i.test(raw)) {
    fail(".mcp.json must not contain Bearer");
  }
  if (/\bPAT\b/i.test(raw) || /ABLETIME_PAT/i.test(raw)) {
    fail(".mcp.json must not contain PAT");
  }
  if (raw.includes("${")) {
    fail(".mcp.json must not contain ${} variable substitution");
  }
}

const rule = readText(`${pluginRoot}/rules/recording.md`);
if (rule !== null && !rule.trim()) {
  fail("rules/recording.md is empty");
}

const permissionsRule = readText(`${pluginRoot}/rules/permissions.md`);
if (permissionsRule !== null && !permissionsRule.trim()) {
  fail("rules/permissions.md is empty");
}

function checkSkillFrontmatter(relPath) {
  const text = readText(relPath);
  if (text === null) {
    return;
  }
  const fmMatch = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    fail(`${relPath} missing YAML frontmatter`);
    return;
  }
  const fm = fmMatch[1];
  if (!/^name\s*:/m.test(fm)) {
    fail(`${relPath} frontmatter missing name`);
  }
  if (!/^description\s*:/m.test(fm)) {
    fail(`${relPath} frontmatter missing description`);
  }
  const toolsMatch = fm.match(/^allowed-tools\s*:(.*)\r?\n?((?:[ \t]+-.*\r?\n?)*)/m);
  if (toolsMatch) {
    const entries = [
      ...toolsMatch[1].split(/[\s,]+/),
      ...toolsMatch[2].split(/\r?\n/).map((line) => line.replace(/^\s*-\s*/, "")),
    ].map((entry) => entry.trim()).filter(Boolean);
    const prefixes = Object.keys((mcp && mcp.mcpServers) || {}).map(
      (key) => `mcp__plugin_${plugin && plugin.name}_${key}__`,
    );
    for (const entry of entries.filter((entry) => entry.startsWith("mcp__"))) {
      const prefix = prefixes.find((p) => entry.startsWith(p));
      if (!prefix || entry.length === prefix.length) {
        fail(`${relPath} allowed-tools entry ${entry} must be mcp__plugin_${plugin && plugin.name}_<server in .mcp.json>__<tool>`);
      }
    }
  }
}

checkSkillFrontmatter(`${pluginRoot}/skills/record-time/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/watch/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/intake/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/sorting-hat/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/bugfix/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/walkthrough/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/reports/SKILL.md`);
checkSkillFrontmatter(`${pluginRoot}/skills/board/SKILL.md`);

const hooksJson = readJson(`${pluginRoot}/hooks/hooks.json`);
if (hooksJson) {
  const hooks = hooksJson.hooks ?? {};
  if (!Array.isArray(hooks.SessionStart) || hooks.SessionStart.length === 0) {
    fail("hooks/hooks.json missing SessionStart hook");
  }
  let sessionStartScripts = 0;
  for (const [event, groups] of Object.entries(hooks)) {
    if (!Array.isArray(groups)) {
      continue;
    }
    for (const group of groups) {
      for (const handler of group?.hooks ?? []) {
        for (const part of [handler?.command, ...(handler?.args ?? [])]) {
          if (typeof part === "string" && part.includes("${CLAUDE_PLUGIN_ROOT}")) {
            const scriptRel = part.replace("${CLAUDE_PLUGIN_ROOT}/", "");
            if (!existsSync(join(root, pluginRoot, scriptRel))) {
              fail(`Hook script does not exist: ${pluginRoot}/${scriptRel}`);
            } else if (event === "SessionStart") {
              sessionStartScripts += 1;
            }
          }
        }
      }
    }
  }
  if (sessionStartScripts === 0) {
    fail("hooks/hooks.json SessionStart hook must run a script in the plugin");
  }
}

if (errors.length) {
  console.error("validate-plugin failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log("validate-plugin: ok");
