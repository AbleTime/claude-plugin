---
name: bugfix
description: Apply a fix for a task and open a pull request. Use for bugfix, issue fix, or when a task should become a PR.
allowed-tools:
  - mcp__plugin_abletime_plugins__notify
  - mcp__plugin_abletime_plugins__get_task
---

# Bugfix

Fix the task. Open the PR. Then `notify`.

## Instructions

1. Read the task with `get_task`. The task is the scope. Do not expand it.
2. Apply the fix in this repo. Follow the repo's existing rules. Leave a test when the change is functional.
3. Open a pull request for that fix.
4. Call `notify` with `title`, `body`, and `timeflowTaskId` of that task. That is how the person hears the fix is up. Do not use chat as the notify.
