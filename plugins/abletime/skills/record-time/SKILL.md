---
name: record-time
description: Record AbleTime drafts, keep an open entry current, and create a task when the work needs one. Use when recording time, opening or updating drafts, creating a task the work belongs to, or refreshing minutes and description on an open entry.
allowed-tools:
  - mcp__plugin_abletime_plugins__orientation
  - mcp__plugin_abletime_plugins__accept_entry
  - mcp__plugin_abletime_plugins__refresh_feeds
  - mcp__plugin_abletime_plugins__upsert_entry
  - mcp__plugin_abletime_plugins__update_entry
  - mcp__plugin_abletime_plugins__list_entries
  - mcp__plugin_abletime_plugins__create_task
---

# Record time

## When to use

- Recording time against a task
- Opening or updating draft calendar entries
- Creating a task the work belongs to when none fits
- Keeping an open entry's minutes (and description, when the story changed) current
- Pulling calendar feeds when the person asks
- Accepting a draft when the person asks and agent acceptance is on

## Instructions

1. Call `orientation` first. Load any workspace working document if present (for example `.claude/abletime-working-document.md`); it may tighten cadence and voice but never loosen AbleTime's recording rules.
2. Open a draft with `upsert_entry` against the task the work advances. If you cannot tell which task, ask once. If none fits, `create_task` in todo and record against that. Only overhead (meetings, training) is recorded without a task.
3. Refresh minutes with `update_entry` on that calendar entry id, about every four turns or at a natural pause — whichever comes first. Omit the description so the stored account stays. If more than ten minutes have passed since the last write, update the draft now.
4. Rewrite the description only when the story of the whole span has changed. Read the current record with `list_entries` first, then send one coalesced account on `update_entry`. Never an append about the last few minutes.
5. Close and open a new entry with `upsert_entry` at midnight, a task-state change, a real gap away from the work, or a switch of focus to different work. A closed entry is never reopened.
6. Never overlap two entries on the same task. Refresh the open one, or close it and open a later one after it ends.
7. Stamp `source` and `sourceKey` on `upsert_entry`. The same pair rewrites that entry. A change to an existing draft is `update_entry` by the calendar entry id the write answered with.
8. Never accept a draft unless the person asked you to and agent acceptance is on. Then call `accept_entry`. If it is refused because the setting is off, say so. Do not retry.
9. When they ask to pull the calendar, call `refresh_feeds`.
10. Keep bookkeeping quiet — do not narrate recording in chat.
