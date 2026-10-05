# AGENTS.md — Muse-Chat-MCP

Guidance for AI coding agents working in this repository.

## What this is

MCP server + OpenAI-compatible HTTP shim that expose Meta Muse (`muse.ai`, "Hatch") by
driving a real, logged-in Chrome with Playwright. See `README.md` for usage.

## Map

- `muse-driver.mjs` — browser driver (selectors, `_run`/`chat`/`chatStream`, `_serial`).
- `muse-server.mjs` — MCP stdio server (7 tools) + shim bootstrap; `--self-test`,
  `--dump-dom`, `--serve-only`.
- `muse-openai-shim.mjs` — OpenAI shim (`/v1/models`, `/v1/chat/completions`).
- `muse-cli.mjs` — CLI over the shim.
- `docs/index.html` — GitHub Pages landing page.

## Invariants (do not break)

- CDP-attached sessions **disconnect only** on close — never kill the user's browser.
- All browser work is serialized through `driver._serial`.
- Streaming emits only **monotonic, stability-quieted** text; exactly one `finish_reason`.
- Tool calling is **decision-only** (Muse must not actually execute the tool).
- Prompts are sent **verbatim** — never add `### USER/### ASSISTANT` roleplay markers or a
  "continue the conversation" wrapper; Muse flags those as prompt-injection and refuses.
- Attachments go on the hidden composer `input[type="file"]` via `setInputFiles`.
- **Never** commit secrets: no `.muse-profile/`, no `*.har`, no tokens.

## Verify changes

```bash
npm run selftest
node muse-cli.mjs "Say hello in three words."
```
