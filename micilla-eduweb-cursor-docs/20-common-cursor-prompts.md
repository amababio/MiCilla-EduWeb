# 20 — Common Cursor Prompts for MiCilla EduWeb

## Purpose

Use these prompts to control Cursor and avoid mistakes.

---

# Start a New Cursor Session

```txt
Read 00-project-rules.md first and follow it strictly.

Do not implement anything yet.

Confirm your understanding of:
1. The product direction
2. The current phase
3. What is allowed
4. What is not allowed
5. Where you must stop
```

---

# Start a Phase

```txt
Read 00-project-rules.md and 01-master-implementation-roadmap.md.

We are working only on the phase file I will paste next.

Do not implement anything yet.

First explain your understanding of the phase, what you will build, what you will not build, and the stop point.
```

---

# Ask Cursor to Implement a Phase

```txt
Proceed with implementation for this phase only.

Do not add future-phase features.

Do not redesign the product direction.

Keep the code simple, readable, and beginner-friendly.

After implementation, provide:
1. Files created/changed
2. What changed
3. How to test
4. Expected result
5. Known limitations
6. Suggested git commit message
```

---

# Ask Cursor to Review Before Coding

```txt
Before changing files, list:
1. Files you plan to create
2. Files you plan to edit
3. Commands you plan to run
4. Risks or assumptions
5. How I will test the result

Do not code yet.
```

---

# Ask Cursor to Fix an Error Only

```txt
Fix only this error.

Do not refactor unrelated files.

Do not add new features.

Explain the cause briefly, make the smallest safe fix, and tell me what command to rerun.

Error:
[paste error here]
```

---

# Ask Cursor to Explain Terminal Output

```txt
Explain this terminal output in simple terms.

Tell me:
1. Whether it succeeded or failed
2. What the important lines mean
3. What I should do next

Output:
[paste output here]
```

---

# Ask Cursor to Stop Scope Creep

```txt
Stop.

You are adding or discussing features outside the current phase.

Return to the current phase only.

Restate the allowed scope and continue only within it.
```

---

# Ask Cursor for a Checkpoint Summary

```txt
Give me a checkpoint summary.

Include:
1. What is complete
2. What is not complete
3. Files changed
4. How to test
5. Whether we are still within the current phase
6. Suggested git commit message
```

---

# Ask Cursor to Prepare a Commit

```txt
Review the current changes for this phase.

Do not change code unless there is a clear bug.

Tell me:
1. Whether the phase acceptance criteria are met
2. What command to run before committing
3. Suggested git commit message
```

---

# Ask Cursor to Continue After a Successful Test

```txt
The output matches the expected result.

Continue to the next checkpoint within the same phase only.

Do not move to the next phase.
```

---

# Ask Cursor to Create a File Without Implementing Code

```txt
Create or update only the requested documentation file.

Do not change application code.

Do not implement features.

After writing the file, summarize what it contains.
```

---

# Ask Cursor to Compare Against Project Rules

```txt
Compare the current implementation against 00-project-rules.md and the current phase file.

Tell me:
1. Any scope violations
2. Any missing acceptance criteria
3. Any unnecessary complexity
4. Any recommended fixes before moving forward

Do not change code yet.
```

---

# Ask Cursor to Generate a Handoff Summary

```txt
Create a handoff summary for the next chat or next Cursor session.

Include:
1. Current phase
2. Completed checkpoints
3. Files changed
4. Commands tested
5. Current known issues
6. Next recommended step
7. Important project rules to remember
```

---

# Golden Rule Prompt

Use this often:

```txt
Implement the smallest safe change needed for the current checkpoint.
Do not add future features.
Do not refactor unrelated code.
Explain how to test.
```
