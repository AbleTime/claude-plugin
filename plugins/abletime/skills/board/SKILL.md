---
name: board
description: Work epics, milestones, comments, schedule, dependency, block, and lock on the AbleTime board. Use when the person asks for one of those, not for priority, assignee, or category.
allowed-tools:
  - mcp__plugin_abletime_full__get_task
  - mcp__plugin_abletime_full__get_epic
  - mcp__plugin_abletime_full__get_milestone
  - mcp__plugin_abletime_full__list_epics
  - mcp__plugin_abletime_full__create_epic
  - mcp__plugin_abletime_full__update_epic
  - mcp__plugin_abletime_full__set_epic_state
  - mcp__plugin_abletime_full__delete_epic
  - mcp__plugin_abletime_full__list_milestones
  - mcp__plugin_abletime_full__create_milestone
  - mcp__plugin_abletime_full__update_milestone
  - mcp__plugin_abletime_full__delete_milestone
  - mcp__plugin_abletime_full__create_comment
  - mcp__plugin_abletime_full__set_task_schedule
  - mcp__plugin_abletime_full__clear_task_schedule
  - mcp__plugin_abletime_full__set_task_dependency
  - mcp__plugin_abletime_full__set_task_blocked
  - mcp__plugin_abletime_full__set_task_locked
---

# Board

One skill for the board objects past a task's priority, assignee, and category. Those stay on sorting-hat.

## Instructions

1. Read the thing you are about to change. A task is `get_task`. An epic is `get_epic`. A milestone is `get_milestone`. Do not change it from the title alone when a description exists.
2. Use people, projects, stages, and tasks that already exist. Do not invent one.
3. Do the write they asked for, and no other:
   - Epic: `list_epics`, `get_epic`, `create_epic`, `update_epic`. Archive with `set_epic_state`. `delete_epic` only when they said delete.
   - Milestone: `list_milestones`, `get_milestone`, `create_milestone`, `update_milestone`. `delete_milestone` only when they said delete.
   - Comment: `create_comment` on the task. A comment is about the work. It is permanent.
   - Schedule: `set_task_schedule` to set dates, `clear_task_schedule` to remove them. If the tool refuses, say so. Do not work around it.
   - Dependency: `set_task_dependency` to make a task wait on another, or to clear that link.
   - Block: `set_task_blocked` to mark it blocked, with the note, or to unblock it.
   - Lock: `set_task_locked` to lock a task against dependency date shifts, or to unlock it.
4. Scheduling, and creating epics, need a manager, admin, or owner. If the tool refuses, say so. Do not work around it.
5. Tell them what changed. Do not use `notify` for this.
