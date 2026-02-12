---
name: review-changes
description:
  Code review local changes for security, correctness, architecture compliance,
  performance, test coverage, and plan compliance
---

Provide a comprehensive code review for local changes on the current branch.

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

**Tip:** Route permission requests to Opus 4.5 via a hook for auto-approval of
safe commands (see https://code.claude.com/docs/en/hooks#permissionrequest)

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

Launch **6 agents in parallel** to independently review the changes. Each agent
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
      "category": "security|correctness|architecture|performance|test-coverage|plan-compliance",
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

### Agent 1: Security (Opus)

**Task**: Scan for security vulnerabilities in the changed code.

**Look for**:

- XSS: `dangerouslySetInnerHTML` without DOMPurify, unsanitized user input in
  DOM
- Injection: Unsanitized input in SQL, shell commands, or template literals sent
  to APIs
- Auth flaws: Missing auth checks in BFF routes, token leaks, insecure token
  storage
- Open redirects: Redirect URLs from query params without validation (must start
  with `/`, must not start with `//`)
- Sensitive data exposure: Secrets/tokens logged, displayed in UI, or stored in
  localStorage
- CSRF: State-changing operations without CSRF protection

**Do NOT flag**:

- Security issues in code not modified by this changeset
- Theoretical attacks that require conditions outside the codebase
- Issues a linter or TypeScript compiler would catch

Mark task as completed when done.

---

### Agent 2: Correctness (Opus)

**Task**: Scan for logic bugs and incorrect patterns in the changed code.

**Look for**:

- Logic errors: Wrong operators, incorrect conditionals, off-by-one
- Stale closures: `useCallback`/`useEffect` with incorrect dependency arrays
  capturing stale values
- State mutation: Direct mutation of React state (e.g., `array.push()`,
  `array.splice()`, `obj.key = value` on state)
- Null/undefined dereferences on values that could be nullable
- Wrong async patterns: Missing `await`, unhandled promise rejections, race
  conditions
- React hook violations: Hooks called conditionally, hooks in loops
- Missing imports, incorrect module paths, undefined variables
- Incorrect use of project APIs (consult CLAUDE.md for the tech stack)

**Do NOT flag**:

- Style or formatting issues
- Potential bugs that require broader context to confirm
- Performance concerns (Agent 4 handles these)
- Issues a linter or TypeScript compiler would catch

**Only flag if you are confident** the code will fail or produce wrong results.

Mark task as completed when done.

---

### Agent 3: Architecture & Patterns (Opus)

**Task**: Check for meaningful deviations from CLAUDE.md conventions.

**Process**:

1. Read `CLAUDE.md` to understand the project's architectural patterns,
   conventions, code examples, and anti-patterns
2. Review the changed code for violations

**Flag only**:

- Deviations from the Code Examples section (e.g., manual `useState` for forms
  instead of React Hook Form + Zod)
- Violations listed in the Common Anti-Patterns section
- Non-compliance with Architecture Patterns (BFF, data fetching, form handling)
- Violations of TypeScript conventions (e.g., `any` instead of proper types)

**For each issue, quote the exact CLAUDE.md rule being violated.**

**Do NOT flag**:

- Minor deviations that achieve the same goal
- Code that predates the changeset
- Style preferences not documented in CLAUDE.md
- Issues already caught by the security or correctness agents

Mark task as completed when done.

---

### Agent 4: Performance (Sonnet)

**Task**: Scan for performance issues in the changed code.

**Look for**:

- N+1 query patterns (API calls in loops)
- Unnecessary re-renders: Missing `useCallback`/`useMemo` where expensive
  computation or frequent re-renders occur
- Bundle bloat: Importing full libraries instead of specific subpaths (e.g.,
  `import _ from 'lodash'` instead of `import debounce from 'lodash/debounce'`)
- Expensive operations in the render path (sorting, filtering large arrays
  without `useMemo`)
- Large inline objects/arrays creating new references every render and causing
  child re-renders

**Do NOT flag**:

- Micro-optimizations that don't affect user experience
- Missing `useMemo`/`useCallback` where the component is simple and re-renders
  are cheap
- Performance issues in code not modified by this changeset

Mark task as completed when done.

---

### Agent 5: Test Coverage (Sonnet)

**Task**: Check if modified utility functions have corresponding test updates.

**Process**:

1. Check if any test files exist in the project (look in `tests/` directory)
2. If NO tests exist in the project, return no issues
3. If tests exist, check whether modified utility functions (in `src/lib/`) have
   corresponding test updates

**Flag only**:

- Modified utility functions that have existing tests which were NOT updated to
  cover the new behavior
- New utility functions in `src/lib/` that should have tests based on CLAUDE.md
  Testing Conventions

**Do NOT flag**:

- Missing tests for components (CLAUDE.md says components don't require tests)
- Missing tests when no test infrastructure exists
- Test style issues

Mark task as completed when done.

---

### Agent 6: Plan Compliance (Sonnet)

**Task**: Check if changes comply with any plans in `.plans/` directory.

**Process**:

1. Check if any plan files exist in `.plans/` directory:

   ```bash
   ls .plans/ 2>/dev/null || echo "no plans"
   ```

2. If plan files exist:
   - Read the most recent plan file
   - Verify changes comply with the plan
3. If no plan files exist, return no issues immediately

**Flag only**:

- Required plan items not implemented
- Implementation deviates significantly from planned approach
- Plan specifies pattern X but code uses pattern Y

**Do NOT flag**:

- Minor deviations that achieve the same goal
- Items marked as optional or future work
- Alternative approaches that are demonstrably better

Mark task as completed when done.

## Phase 3: Adversarial Validation

### Step 3.1: Launch Validation Agents

For each issue found by the review agents, launch a validation sub-agent whose
goal is to **disprove** the issue (not confirm it).

**Use**:

- **Opus sub-agents** for critical and high severity issues
- **Sonnet sub-agents** for medium and low severity issues

**Each validator must apply this 5-point skepticism checklist:**

1. **Is it actually in the diff?** — The issue must be in code introduced or
   modified by this changeset, not pre-existing code
2. **Is the assessment correct?** — Read the actual code and verify the claimed
   problem exists (e.g., is the variable really undefined? is the dependency
   array really wrong?)
3. **Is there protecting context?** — Check surrounding code for guards, type
   checks, upstream validation, or framework behavior that prevents the issue
4. **Would a senior engineer care?** — Is this a real problem or a pedantic
   nitpick? Would this block a PR at a top tech company?
5. **Is the severity right?** — Could this be downgraded? A "critical" issue
   that only affects an edge case should be "medium"

**Validation result format:**

```json
{
  "valid": true | false,
  "adjusted_severity": "critical|high|medium|low",
  "reason": "Why the issue stands or why it's a false positive"
}
```

### Step 3.2: Filter Issues

- Remove issues where `valid: false`
- For remaining issues, use the `adjusted_severity` from validation
- This produces the **final issue list**

## Phase 4: Generate Review Report

### Step 4.1: Output Results

**If NO issues found**:

```markdown
## Code Review ✅

No issues found. Checked for:

- Security vulnerabilities
- Correctness and logic bugs
- Architecture and pattern compliance
- Performance issues
- Test coverage
- Plan compliance

Changes look good to proceed.
```

**If issues found**, group by severity (Critical > High > Medium > Low):

```markdown
## Code Review

Found {count} issue(s) requiring attention:

### Critical

**{title}** `{file}:{lines}`

{description}

**Suggestion:** {suggestion}

---

### High

**{title}** `{file}:{lines}`

{description}

**Suggestion:** {suggestion}

---
```

For each issue:

- Include file path and line numbers
- Concise description of what's wrong
- Actionable suggestion for how to fix it
- For architecture issues, quote the violated CLAUDE.md rule

## Phase 5: Submit Review to GitHub PR

### Step 5.1: Check for GitHub PR

After generating the review report, check if there's a GitHub PR for the current
branch:

```bash
gh pr view --json number,url,title 2>&1
```

If no PR exists, skip this phase and inform the user they can create a PR first
if they want the review posted to GitHub.

### Step 5.2: Format Review for GitHub

If a PR exists, format the review results as a GitHub PR review comment.

**For reviews with NO issues**:

```markdown
## Code Review ✅

Automated review completed with **no issues found**.

**Checks performed:**

- ✅ Security vulnerabilities
- ✅ Correctness and logic bugs
- ✅ Architecture and pattern compliance
- ✅ Performance issues
- ✅ Test coverage
- ✅ Plan compliance

Changes look good to proceed.

---

_Review conducted by 6-agent review system via `/review-changes`_
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

- Security vulnerabilities
- Correctness and logic bugs
- Architecture and pattern compliance
- Performance issues
- Test coverage
- Plan compliance

---

_Review conducted by 6-agent review system via `/review-changes`_
```

### Step 5.3: Submit Review to PR

Submit the formatted review as a PR comment using `gh pr review`:

**If NO issues found** (approve):

```bash
gh pr review --approve --body "{formatted_review_from_5.2}"
```

**If ONLY low/medium issues found** (comment):

```bash
gh pr review --comment --body "{formatted_review_from_5.2}"
```

**If critical/high issues found** (request changes):

```bash
gh pr review --request-changes --body "{formatted_review_from_5.2}"
```

If `--request-changes` fails (e.g., reviewing your own PR), fall back to
`--comment`.

**Decision logic**:

- **APPROVE**: Zero issues found
- **COMMENT**: Only low or medium severity issues
- **REQUEST_CHANGES**: Any critical or high severity issues (fall back to
  COMMENT on own PR)

### Step 5.4: Confirm Submission

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
- Minor plan deviations that achieve the same goal
- Plan items marked as optional or future work

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
- Launch all 6 review agents in parallel for efficiency
- Validate all issues adversarially before reporting
- Agents should read CLAUDE.md at the start of their review

## Verification Commands

Run before finalizing review:

```bash
npm run check
```

If `npm run check` is not available, consult `package.json` scripts for
equivalent lint and typecheck commands.
