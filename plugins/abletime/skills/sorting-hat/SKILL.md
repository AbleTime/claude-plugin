---
name: sorting-hat
description: Set priority, assignee, and category on tasks. Use for sorting hat, triage, intake follow-up, or when tasks need assignment or priority.
allowed-tools:
  - mcp__plugin_abletime_full__notify
  - mcp__plugin_abletime_full__get_task
  - mcp__plugin_abletime_full__set_task_priority
  - mcp__plugin_abletime_full__set_task_assignee
  - mcp__plugin_abletime_full__update_task
---

# Sorting hat

Sort existing tasks. Then `notify`.

## Instructions

1. Read the task with `get_task`. Do not sort from the title alone when a description exists.
2. Set what the task needs among: priority (`set_task_priority`), assignee (`set_task_assignee`), category (`update_task`). Use people and categories that exist on the project. Do not invent a person, a priority, or a category.
3. Same failure on more than one task: say so, then sort the set together — do not treat each duplicate as a new emergency.
4. Call `notify` on each task you changed (`title`, `body`, `timeflowTaskId`). That is how the person hears it was sorted. Do not use chat as the notify.
