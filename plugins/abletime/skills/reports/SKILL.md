---
name: reports
description: Ask AbleTime for a named report and hand back the share link. Use when the person wants a report, an overview, hours, delivery, burn, or how the hours were written.
allowed-tools:
  - mcp__plugin_abletime_plugins__get_report
  - mcp__plugin_abletime_plugins__tool_schema
  - mcp__plugin_abletime_plugins__list_projects
---

# Reports

The report is the share link. Do not draw your own chart from the numbers.

## Instructions

1. Call `get_report`. `startDate` and `endDate` are `YYYY-MM-DD`.
2. Name what to draw with `reports`, by name or by code. The names, codes, and which lines need `createdVia` are on `tool_schema` for `get_report`. Do not memorize the catalogue.
3. Resolve a project they named with `list_projects` and pass its id. Do not invent a project.
4. Hand them `path` from the answer, on the same host as the connection, and the keycode with it. The page opens without signing in. The link expires in fourteen days. Say a coverage gap in plain words when the answer carries one — a missing rate, cost, capacity, estimate, or budget — and what that does to the page.
5. Leave `sets` off. Leave `includeData` off unless they ask for a number the link does not state. Then read the document and answer that number. Do not paste the document.
6. Pass `createdVia` only when they ask how the hours were written. The reports whose lines say they need it are the only ones that split user, api, and agent.
