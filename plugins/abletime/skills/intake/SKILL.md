---
name: intake
description: File a report onto a project and stamp the named source. Use for intake, cron errors, log alerts, cloud-agent filing, or when a failure needs a task.
allowed-tools:
  - mcp__plugin_abletime_full__notify
  - mcp__plugin_abletime_full__orientation
  - mcp__plugin_abletime_full__list_projects
  - mcp__plugin_abletime_full__create_task
---

# Intake

File one task on the project this report belongs to. Stamp the source. Then `notify`.

## Instructions

1. The project is required. Resolve it through `orientation` / `list_projects` from the name the report or the person already has. Do not invent a project. If there is no name, ask once and wait.
2. The source is required. Put it on `externalRefSource`. Use the name the report already has. Do not invent a source. If there is no name, ask once and wait.
3. Stamp `externalRefId`, `externalRefName`, and `externalRefUrl` only when the report carries them.
4. `create_task` on that project. Title is the failure in one line. Description is the report. Category is one of that project's categories — pick the one that fits; do not invent a category.
5. Call `notify` with `title`, `body`, and `timeflowTaskId` of the new task. That is how the person hears it was filed. Do not use chat as the notify.
