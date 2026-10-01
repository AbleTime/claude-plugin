# AbleTime recording

## Work belongs to a task

Record work against the task it advances. When no task fits, create one as part of starting the work. Only overhead that advances no deliverable — meetings, training and the like — is recorded without a task.

## Work reaches doing through recorded time

A task reaches doing through time recorded against it, not by placing it in doing. Create a task in backlog or todo and let the work itself move it.

## A comment is a note on the work

A comment is a permanent note on a task, visible to everyone who works on that task. Write about the deliverable — what was found, decided, or what the next person needs — never about the people doing the work. An account of one segment belongs on that entry; the current state of the work belongs on the task description.

## One entry, one unbroken segment

Close the current entry and open a new one at midnight, a change in the task's state, a real gap away from the work, or a switch of focus to different work. A closed entry is never reopened.

## Keep the open draft current

Refresh the open draft at least every four turns, or at any natural pause — whichever comes first. Never leave a draft more than ten minutes without an update: if more than ten minutes have passed since the last write, update it now.

## Overlap is context, not a verdict

Writes may answer with your own entries whose span intersects the one just written. The server never refuses a write because it overlaps — that list is context for what to do next, not a judgment on a write that already happened. Overlap across different tasks can appear; overlap on the same task is not a write you make.

## Never overlap entries on the same task

Two of your entries on the same task must not share a time span. Keep one open segment on that task and refresh it, or close it and open a later one after it ends. If a write comes back listing another of your entries on the same task, correct it so only one span remains.

## Wall-clock time, no timezone math

Entry date and time is the person's plain local wall clock: `YYYY-MM-DD HH:MM:00` with no zone, offset, or conversion. Read the clock; never correct it through a timezone.

## Duration is measured and bounded

Minutes are a whole number from 1 to 1440 and measure attention actually spent in the segment — never elapsed clock across a gap, and never time not yet spent. Convention: at least five minutes. Work that runs past midnight is two entries.

## The description is the account

One short prose account of what was done in this span, in the person's words (max 500 characters). Sending a description replaces the stored one: rewrite the whole span as one coalesced account; do not append. Where more room is needed, the task description carries the detail.

## Drafts and acceptance

Agent writes arrive as drafts. The person accepts. An agent may accept only when the person asked and agent acceptance is on. Both are required; leave drafts for them unless told otherwise.

## Stamp provenance; address by id

Stamp every agent write with `source` and `sourceKey`. Change an entry by the calendar entry id the write answered with. The same source + sourceKey pair updates the existing entry instead of adding a second one.

## Orientation descriptions may be partial

Long descriptions in orientation arrive truncated. Do not quote them as complete and never send them back as the account.

## Read before writing over

Before rewriting a description, read the current record through the tools and rewrite from what comes back. Assume what you already hold is stale.

## Tool schemas on demand

`tools/list` carries required arguments only. Use `tool_schema` for one tool's full arguments, or `full_catalog` for every tool.

## Bookkeeping stays quiet

Make the recording call and say nothing about it in chat. Do not narrate recording.

## Ask once and wait

When a needed record detail is unknown — which task, when a gap began or ended — ask once and wait. Do not guess.

## Do not record pure conversation

Do not record pure conversation that advances no deliverable.
