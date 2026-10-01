---
name: watch
description: Poll via MCP for tasks assigned to me or landing in a named stage, and notify on a hit. Use for watch, notify, assigned to me, stage landing, /abletime:watch, or "let me know when a task lands in a stage."
allowed-tools:
  - mcp__plugin_abletime_plugins__notify
  - mcp__plugin_abletime_plugins__orientation
  - mcp__plugin_abletime_plugins__list_tasks
  - mcp__plugin_abletime_plugins__get_project
  - mcp__plugin_abletime_plugins__tool_schema
  - Read(~/.abletime/watches.json)
  - Edit(~/.abletime/watches.json)
  - CronList
  - CronDelete
---

# Watch

Poll on a timer for assigned tasks or stage landings. A hit calls `notify`. Chat is not the notify. Do not record time on watch ticks — use the record-time skill for that.

## Quiet

Background work. No chat on start, ticks, or hits. Do not narrate orientation, id resolution, file writes, what is being watched, or that watching has begun.

- **Start:** save the watch, run the first check, `notify` if that check hits, then start the loop. No chat.
- **Ticks:** `notify` when something new matches. Empty tick: no chat, no notify.
- **Stop:** end the loop. One short line that watching stopped. Nothing else.

## Start and stop

- **Start:** `/abletime:watch` or natural language ("watch tasks assigned to me", "notify when something lands in Marketing").
- **Stop:** `/abletime:watch stop` or "stop watching" — find the loop's scheduled task with `CronList` and cancel it with `CronDelete`. Keep the watch list in `~/.abletime/watches.json`.

Any text after `/abletime:watch` is the user's watch request (e.g. stage name, project, or `stop`). `/abletime:watch tick` is a watch tick sent by the loop.

Starting a watch saves it to `~/.abletime/watches.json`, runs the first check, then starts the recurring tick with the built-in loop: `/loop 10m /abletime:watch tick` (put the agreed interval in place of `10m` when the user asked for longer than 10 minutes). One watch loop at a time; starting a new loop ends the running one but keeps the watch list in `~/.abletime/watches.json`.

The built-in loop is the only driver. Do not start a cloud routine or a scheduled cloud agent. Do not wait with a shell `sleep`. Do not use a stop hook. Do not invent watch kinds beyond what this skill defines.

## Watch file

Persist watches in `~/.abletime/watches.json` (user-local — never the workspace, never the plugin tree):

```json
{
  "watches": [
    {
      "kind": "assigned",
      "assignedUserId": "<from orientation>",
      "lastSeen": "<ISO8601 or empty>"
    },
    {
      "kind": "stage",
      "projectId": "<id>",
      "projectName": "<name>",
      "stageId": "<id>",
      "stageName": "Marketing",
      "lastSeen": "<ISO8601 or empty>"
    }
  ]
}
```

Resolve "me" and stage names through MCP before saving ids. Merge new watches into the existing list; do not drop unrelated watches unless the user asks to remove them.

## Timer watches (poll on interval)

Only these two kinds run on the timer:

1. **Assigned to me** — call `orientation` for `userId`, then `list_tasks` with `assignedUserId`. Use `updatedSince` from the watch's `lastSeen` when set.
2. **Stage landing** — call `get_project` (expand stages) to resolve the stage name to `stageId`, then `list_tasks` with `stageId` and `projectId`. Use `updatedSince` from `lastSeen` when set.

After a check that finds matches, update each affected watch's `lastSeen` to the newest matching task's update time (or now if none returned a timestamp).

## Hit

For each new matching task, call `notify` with `title` (required), `body` (what matched), and `timeflowTaskId` of that task. One call per task. Do not also write it in chat.

## One-shot (no timer)

Comments, unblocked tasks, feeds, and workload questions are answered once on demand — do not add them to the watch file or start a loop.

## Polling cadence

Default interval: **10 minutes**. Never poll faster than 10 minutes. Use a longer interval only when the user asks; pass it to `/loop` in place of `10m`.

Each tick:

1. Run the checks for every watch in the file.
2. If something new matches, `notify` for each matching task. Empty tick: **no chat, no notify**.
3. End the turn. The loop sends the next tick.

When the loop runs `/abletime:watch tick`, run the tick above. If this chat is not a watch loop, ignore it and do not reply.

## MCP tools

Use `orientation`, `list_tasks`, `get_project`, `notify`. Read `tool_schema` when argument shapes are unclear.
