---
name: review-small
description:
  Streamlined code review for small, straightforward PRs (< 200 lines, < 5
  files, low complexity)
---

Provide a focused code review for small, straightforward changes.

## When to Use This Skill

Use `/review-small` for:

- Small bug fixes (< 200 lines changed)
- Simple feature additions (1-2 new files, straightforward logic)
- Documentation updates
- Configuration changes
- Refactors with repetitive patterns across multiple files

Use `/review-changes` (full review) instead for:

- New architectural patterns or native modules
- Complex state management changes
- Multi-phase features with intricate logic
- Security-sensitive changes (auth, VPN, permissions)
- Changes that introduce new dependencies or APIs

## Pre-flight Check

Before starting, ensure you are working from the repository root directory:

- Your working directory must be the repository root (where `CLAUDE.md` and
  `package.json` exist)
- If unsure, run `ls CLAUDE.md package.json` to verify you're in the correct
  directory

**Agent assumptions (applies to all agents and subagents):**

- All tools are functional and will work without error. Do not test tools or
  make exploratory calls.
- Only call a tool if it is required to complete the task. Every tool call
  should have a clear purpose.

## Phase 1: Discover Changes

### Step 1.1: Gather Context

Check for changes in order of preference:

1. Current conversation context (what we've been working on)
2. Git staged changes: `git diff --cached --stat`
3. Committed changes on current branch vs main: `git log main..HEAD --oneline`
   and `git diff main...HEAD --stat`

If there are no changes to review (no staged changes and no commits ahead of
main), inform the user and stop.

### Step 1.2: Get the Diff

Get the full diff for use by review agents:

- Staged changes: `git diff --cached`
- Committed changes: `git diff main...HEAD`

## Phase 2: Parallel Code Review

### Step 2.1: Launch Review Agents

Launch **2 agents in parallel** to independently review the changes. Each agent
reads the diff directly and returns issues found.

**All agents must return issues in this format:**

```json
{
  "issues": [
    {
      "title": "Short descriptive title",
      "file": "path/to/file.ts",
      "lines": "45-50",
      "description": "What is wrong and why it matters",
      "category": "correctness|architecture",
      "severity": "critical|high|medium|low",
      "suggestion": "How to fix it"
    }
  ]
}
```

**Severity definitions (used by all agents):**

- **Critical**: Code will crash, lose data, or create a security vulnerability
- **High**: Code will produce wrong results or violate a core project convention
- **Medium**: Code works but deviates from best practices in a meaningful way
- **Low**: Minor improvement that a senior engineer might suggest

---

### Agent 1: Bug Detection (Opus)

**Task**: Scan for obvious bugs in the diff itself.

**Focus only on the diff** without reading extra context. Flag only significant
bugs; ignore nitpicks and likely false positives.

**Look for**:

- Syntax errors, type errors, undefined variables
- Null/undefined dereferences
- Logic errors (wrong operators, incorrect conditionals)
- Missing imports or incorrect module paths
- React hooks used incorrectly (e.g., hooks in conditionals)
- Async/await issues (missing await, unhandled promises)
- Off-by-one errors, incorrect array access
- Stale closures from incorrect dependency arrays
- Direct mutation of React state
- Framework-specific issues (consult CLAUDE.md for the project's framework and
  common pitfalls)

**Do NOT flag**:

- Style issues
- Potential bugs that require broader context
- Performance concerns
- Issues that depend on specific inputs
- Issues a linter or TypeScript compiler would catch

**Only flag if you are confident** the code will fail or produce wrong results.

Mark task as completed when done.

---

### Agent 2: CLAUDE.md Compliance (Sonnet)

**Task**: Audit changes for CLAUDE.md compliance.

**Scope**: Review all changed files for violations of guidelines in CLAUDE.md.

**Process**:

1. Read `CLAUDE.md` to understand the project's architectural patterns,
   conventions, code examples, and anti-patterns
2. Review all changed files for violations

**Flag only**:

- Deviations from the Code Examples section
- Violations listed in the Common Anti-Patterns section
- Non-compliance with Architecture Patterns (BFF, data fetching, form handling)
- Violations of TypeScript conventions (e.g., `any` instead of proper types)

**For each issue, quote the exact CLAUDE.md rule being violated.**

**Do NOT flag**:

- Minor deviations that achieve the same goal
- Code that predates the changeset
- Style preferences not documented in CLAUDE.md
- Issues already caught by the bug detection agent

Mark task as completed when done.

---

## Phase 3: Generate Review Report

### Step 3.1: Output Results

**If NO issues found**:

```markdown
## Code Review ✅

No issues found. Checked for:

- Bugs and logic errors
- CLAUDE.md compliance

Changes look good to proceed.
```

**If issues found**, group by severity (Critical > High > Medium > Low):

```markdown
## Code Review

Found {count} issue(s) requiring attention:

### {Severity}

**{title}** `{file}:{lines}`

{description}

**Suggestion:** {suggestion}

---
```

For each issue:

- Include file path and line numbers
- Concise description of what's wrong
- Actionable suggestion for how to fix it
- For CLAUDE.md violations, quote the violated rule

## Phase 4: Submit Review to GitHub PR

### Step 4.1: Check for GitHub PR

After generating the review report, check if there's a GitHub PR for the current
branch:

```bash
gh pr view --json number,url,title 2>&1
```

If no PR exists, skip this phase and inform the user they can create a PR first
if they want the review posted to GitHub.

### Step 4.2: Format Review for GitHub

If a PR exists, format the review results as a GitHub PR review comment.

**For reviews with NO issues**:

```markdown
## Code Review ✅

Automated review completed with **no issues found**.

**Checks performed:**

- ✅ Bugs and logic errors
- ✅ CLAUDE.md compliance

Changes look good to proceed.

---

_Streamlined review conducted by `/review-small` skill (2 AI agents)_
```

**For reviews with issues**, format as:

```markdown
## Code Review - {issue_count} Issue(s) Found

{For each severity level with issues:}

### {Severity}

{For each issue at this severity:}

**{title}** `{file}:{lines}`

{description}

**Suggestion:** {suggestion}

---

{End of issues}

**Summary:**

- Critical: {count}
- High: {count}
- Medium: {count}
- Low: {count}

**Checks performed:**

- Bugs and logic errors
- CLAUDE.md compliance

---

_Streamlined review conducted by `/review-small` skill (2 AI agents)_
```

### Step 4.3: Submit Review to PR

Submit the formatted review as a PR comment using `gh pr review`:

**If NO issues found** (approve):

```bash
gh pr review --approve --body "{formatted_review_from_4.2}"
```

**If ONLY low/medium issues found** (comment):

```bash
gh pr review --comment --body "{formatted_review_from_4.2}"
```

**If critical/high issues found** (request changes):

```bash
gh pr review --request-changes --body "{formatted_review_from_4.2}"
```

If `--request-changes` fails (e.g., reviewing your own PR), fall back to
`--comment`.

**Decision logic**:

- **APPROVE**: Zero issues found
- **COMMENT**: Only low or medium severity issues
- **REQUEST_CHANGES**: Any critical or high severity issues (fall back to
  COMMENT on own PR)

### Step 4.4: Confirm Submission

After submitting, display a confirmation message to the user:

```markdown
Review submitted to PR #{number}: {title} {pr_url}

Review type: {APPROVE|COMMENT|REQUEST_CHANGES}
```

If the submission fails (e.g., permissions issue, gh CLI not authenticated),
inform the user and suggest they manually post the review or authenticate with
`gh auth login`.

## False Positives to Avoid

**Do NOT flag these** (these are false positives):

- Pre-existing issues not introduced in this changeset
- Code that appears buggy but is actually correct given surrounding context
- Pedantic nitpicks a senior engineer wouldn't flag in a PR review
- Issues a linter or TypeScript compiler will catch
- Minor code quality concerns not documented in CLAUDE.md
- CLAUDE.md issues explicitly silenced (e.g., `// eslint-ignore`)

## Severity Definitions

- **Critical**: Code will crash, lose data, or create a security vulnerability
- **High**: Code will produce wrong results or violate a core project convention
- **Medium**: Code works but deviates from best practices in a meaningful way
- **Low**: Minor improvement that a senior engineer might suggest

**If not certain, do not flag it.** False positives waste reviewer time and
erode trust.

## Notes

- Use `git diff --cached` for staged changes
- Use `git diff main...HEAD` for committed changes
- Launch review agents in parallel for efficiency
- When citing CLAUDE.md rules, quote the exact rule
