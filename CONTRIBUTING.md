# Contributing

Thanks for helping! This project automates a real browser, so a few invariants matter.

## Dev setup

```bash
git clone https://github.com/fierzone/MUSE_MCP.git
cd Muse-Chat-MCP
npm install
npm run selftest        # log in to Muse once
node muse-cli.mjs "Say hello in three words."
```

## Layout

| File | Role |
| --- | --- |
| `muse-driver.mjs` | Playwright driver: selectors, `_run`/`chat`/`chatStream`, `_serial` queue, persistent launch with CDP fallback |
| `muse-server.mjs` | MCP stdio server (7 tools) + starts the shim; `--self-test`, `--dump-dom`, `--serve-only` |
| `muse-openai-shim.mjs` | OpenAI-compatible HTTP shim (SSE, tool parsing, `SHAPE_RULES`) |
| `muse-cli.mjs` | Thin CLI over the shim |

## Invariants (please keep these true)

- **Never kill the user's browser.** A CDP-attached session must `disconnect` only on `close()`.
- **One shared thread, serialized.** All browser actions go through `driver._serial`.
- **Streaming stays correct.** Emit only monotonic, stability-quieted text (`STREAM_QUIET_MS`); a mid-message draft rewrite must not duplicate in the append-only SSE stream.
- **Exactly one `finish_reason` chunk** per streamed completion.
- **Tool calling is prompt-injected and decision-only** ("do not execute") — otherwise Muse tries to actually perform the action and hangs.
- **Prompts go out verbatim.** Never wrap a message in `### USER/### ASSISTANT` roleplay markers or a "continue the conversation" wrapper — Muse detects that as prompt-injection and refuses. Attachments are set on the hidden composer `input[type="file"]`.
- **No secrets in the repo, ever.** No Chrome profiles, no captures (`*.har`), no tokens.

## Verify

```bash
npm run selftest                      # browser + login + composer
node muse-cli.mjs "Hi in 3 words."    # end-to-end through the shim
```

For streaming/shape regressions, start `startShim()` on a spare port and assert the
concatenated SSE equals the final reply (no duplicated draft).

## Pull requests

- Keep changes focused; match the surrounding style.
- Add no comments unless they explain non-obvious *why*.
- Describe what you verified (command + observed output).
