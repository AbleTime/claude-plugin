# AbleTime for Claude

Official AbleTime plugin for Claude Code. Installs two MCP servers and the customer recording rules so agents can track time, run the board, and read reports without hand-wiring MCP.

Homepage: [https://www.abletime.com](https://www.abletime.com)

## What you get

Two HTTP MCP servers on `https://track.abletime.com`:

| Server | URL | Role |
| --- | --- | --- |
| **full** | `https://track.abletime.com/api/public/v2/mcp/full` | Time and the board |
| **reports** | `https://track.abletime.com/api/public/v2/mcp/reports` | Reports. Its own connection. Not on `/mcp/full`. |

Also included:

- The recording rules (`rules/recording.md`), delivered in full at the start of every session by a `SessionStart` hook
- `/abletime:record-time` for opening and keeping drafts current, pulling calendar feeds, and accepting a draft when asked
- `/abletime:walkthrough`, which reads the public guide at `https://docs.abletime.com/guides/1.0/agentic-ai/using-the-claude-plugin` (the page may not be published yet)
- `/abletime:reports`, which asks for a named report and returns the share link
- `/abletime:board` for epics, milestones, comments, schedule, dependency, block, and lock
- `/abletime:watch` — poll for tasks assigned to you or landing in a named stage, driven by Claude Code's built-in `/loop` (10-minute floor; `notify` on hits, not chat)
- `/abletime:intake`, `/abletime:sorting-hat`, and `/abletime:bugfix` (file and name the source, sort, fix and open a PR; `notify` after each)

Watches persist in `~/.abletime/watches.json` (user-local, not in the repo).

## Reports endpoint

`https://track.abletime.com/api/public/v2/mcp/reports`

This is a second MCP server. You authenticate it on its own, the same way as the first. `/mcp/full` does not serve it.

The tool is `get_report`. It takes a date range and, optionally, which reports to draw by name or by code (`AT-001` upward). The answer is the share link: a stub, a keycode, when the link expires, and a reader path on the same host, `/r/{stub}?key={keycode}`. The page opens without signing in. The link lasts fourteen days. The numbers behind the page are not in the answer unless `includeData` is set.

An owner or admin reads the whole organization, including money. A manager reads their own projects, without money.

## Auth (Claude Code)

Claude Code authenticates with **OAuth**. AbleTime answers unauthenticated MCP calls with a 401 that includes protected-resource metadata. Run `/mcp`, choose the server, and complete sign-in in the browser — once for `full` and once for `reports`.

Do **not** put a PAT or `Authorization` header in `.mcp.json`. A personal access token is an AbleTime credential for other clients (scripts, other tools). It is not the Claude Code install path.

## Install

This repo is a Claude Code plugin marketplace (`/.claude-plugin/marketplace.json`) with one plugin at `plugins/abletime`.

```text
/plugin marketplace add AbleTime/claude-plugin
/plugin install abletime@abletime
```

Claude Code clones the repository with the same authentication `git clone` uses on your machine (a credential helper or SSH key), so that must be able to read the AbleTime GitHub organization.

**Local testing:** load the plugin straight from a clone:

```bash
git clone https://github.com/AbleTime/claude-plugin.git
claude --plugin-dir ./claude-plugin/plugins/abletime
```

After editing files in the clone, run `/reload-plugins` in the session.

## Validate

```bash
npm test
```

Runs `scripts/validate-plugin.mjs` — checks manifest fields, the two live MCP URLs and their `http` type, no auth headers or variable substitution in `.mcp.json`, the recording rules file, required frontmatter on skills, and hook wiring.

```bash
claude plugin validate .
claude plugin validate ./plugins/abletime
```

Checks the marketplace and the plugin the way Claude Code loads them.

## License

MIT
