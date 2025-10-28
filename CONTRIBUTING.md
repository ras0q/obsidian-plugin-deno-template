# Contributing guide

This guide is for human contributors and AI agents to help develop and maintain
this plugin, based on
[obsidian-sample-plugin/AGENTS.md](https://github.com/obsidianmd/obsidian-sample-plugin/blob/master/AGENTS.md).

## Project overview

- Target: Obsidian Community Plugin (TypeScript → bundled JavaScript).
- Entry point: `main.ts` compiled to `main.js` and loaded by Obsidian.
- Required release artifacts: `main.js`, `manifest.json`, and optional
  `styles.css`.

## Environment

You can use [Deno](https://deno.com) for almost everything in development!

- Runtime: **Deno**
- Formatter: **Deno**
- Linter: **Deno** + **ESLint** (with `eslint-plugin-obsidianmd`)
- Type Checker: **Deno**
- Bundler: **esbuild** (`deno bundle` is back in v2.4, but lack of features)

### IDE Integration (VSCode / Cursor)

To get the best experience with Deno (linting, formatting, type-checking), use
the official Deno extension and add this to your `.vscode/settings.json`:

<details>
<summary>.vscode/settings.json</summary>

```json:settings.json
{
  "[css]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[json]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[markdown]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "[yaml]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  },
  "deno.enable": true,
  "deno.lint": true
}
```

</details>

## Commands

### Dev (watch)

```bash
deno task dev
```

This command is the primary way to develop and test the plugin. It will:

- Clone the [sample vault](https://github.com/kepano/kepano-obsidian) to
  `./vault-for-<plugin-id>` (if it doesn't exist).
- Build the plugin and place the artifacts (`main.js`, `manifest.json`) directly
  into the sample vault's plugin directory.
- Watch for changes and automatically rebuild the plugin (live reload).

After running this command, you can open `vault-for-<plugin-id>` to test the
plugin's behavior.

### Check syntax and others (linting & formatting)

```bash
deno task check
```

### Versioning & releases

```bash
# You need to push all commits
deno task bump [patch | minor | major]
```

## File & folder conventions

- **Organize code into multiple files**: Split functionality across separate
  modules rather than putting everything in `main.ts`.
- Source lives in `src/`. Keep `main.ts` small and focused on plugin lifecycle
  (loading, unloading, registering commands).
- **Example file structure**:
  ```
  src/
    main.ts           # Plugin entry point, lifecycle management
    settings.ts       # Settings interface and defaults
    commands/         # Command implementations
      command1.ts
      command2.ts
    ui/              # UI components, modals, views
      modal.ts
      view.ts
    utils/           # Utility functions, helpers
      helpers.ts
      constants.ts
    types.ts         # TypeScript interfaces and types
  ```
- **Do not commit build artifacts**: Never commit `node_modules/`, `main.js`, or
  other generated files to version control.
- Keep the plugin small. Avoid large dependencies. Prefer browser-compatible
  packages.
- Generated output should be placed at the plugin root or `dist/` depending on
  your build setup. Release artifacts must end up at the top level of the plugin
  folder in the vault (`main.js`, `manifest.json`, `styles.css`).

## Manifest rules (`manifest.json`)

- Must include (non-exhaustive):
  - `id` (plugin ID; for local dev it should match the folder name)
  - `name`
  - `version` (Semantic Versioning `x.y.z`)
  - `minAppVersion`
  - `description`
  - `isDesktopOnly` (boolean)
  - Optional: `author`, `authorUrl`, `fundingUrl` (string or map)
- Never change `id` after release. Treat it as stable API.
- Keep `minAppVersion` accurate when using newer APIs.
- Canonical requirements are coded here:
  https://github.com/obsidianmd/obsidian-releases/blob/master/.github/workflows/validate-plugin-entry.yml

## Commands & settings

- Any user-facing commands should be added via `this.addCommand(...)`.
- If the plugin has configuration, provide a settings tab and sensible defaults.
- Persist settings using `this.loadData()` / `this.saveData()`.
- Use stable command IDs; avoid renaming once released.

## Security, privacy, and compliance

Follow Obsidian's **Developer Policies** and **Plugin Guidelines**. In
particular:

- Default to local/offline operation. Only make network requests when essential
  to the feature.
- No hidden telemetry. If you collect optional analytics or call third-party
  services, require explicit opt-in and document clearly in `README.md` and in
  settings.
- Never execute remote code, fetch and eval scripts, or auto-update plugin code
  outside of normal releases.
- Minimize scope: read/write only what's necessary inside the vault. Do not
  access files outside the vault.
- Clearly disclose any external services used, data sent, and risks.
- Respect user privacy. Do not collect vault contents, filenames, or personal
  information unless absolutely necessary and explicitly consented.
- Avoid deceptive patterns, ads, or spammy notifications.
- Register and clean up all DOM, app, and interval listeners using the provided
  `register*` helpers so the plugin unloads safely.

## UX & copy guidelines (for UI text, commands, settings)

- Prefer sentence case for headings, buttons, and titles.
- Use clear, action-oriented imperatives in step-by-step copy.
- Use **bold** to indicate literal UI labels. Prefer "select" for interactions.
- Use arrow notation for navigation: **Settings → Community plugins**.
- Keep in-app strings short, consistent, and free of jargon.

## Performance

- Keep startup light. Defer heavy work until needed.
- Avoid long-running tasks during `onload`; use lazy initialization.
- Batch disk access and avoid excessive vault scans.
- Debounce/throttle expensive operations in response to file system events.

## Coding conventions

- TypeScript with `"strict": true` preferred.
- **Keep `main.ts` minimal**: Focus only on plugin lifecycle (onload, onunload,
  addCommand calls). Delegate all feature logic to separate modules.
- **Split large files**: If any file exceeds ~200-300 lines, consider breaking
  it into smaller, focused modules.
- **Use clear module boundaries**: Each file should have a single, well-defined
  responsibility.
- Bundle everything into `main.js` (no unbundled runtime deps).
- Avoid Node/Electron APIs if you want mobile compatibility; set `isDesktopOnly`
  accordingly.
- Prefer `async/await` over promise chains; handle errors gracefully.

## Mobile

- Where feasible, test on iOS and Android.
- Don't assume desktop-only behavior unless `isDesktopOnly` is `true`.
- Avoid large in-memory structures; be mindful of memory and storage
  constraints.

## Agent do/don't

**Do**

- Add commands with stable IDs (don't rename once released).
- Provide defaults and validation in settings.
- Write idempotent code paths so reload/unload doesn't leak listeners or
  intervals.
- Use `this.register*` helpers for everything that needs cleanup.

**Don't**

- Introduce network calls without an obvious user-facing reason and
  documentation.
- Ship features that require cloud services without clear disclosure and
  explicit opt-in.
- Store or transmit vault contents unless essential and consented.

## Common tasks

### Organize code across multiple files

**main.ts** (minimal, lifecycle only):

```ts
import { Plugin } from "obsidian";
import { DEFAULT_SETTINGS, MySettings } from "./settings.ts";
import { registerCommands } from "./commands.ts";

export default class MyPlugin extends Plugin {
  settings: MySettings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    registerCommands(this);
  }
}
```

**settings.ts**:

```ts
export interface MySettings {
  enabled: boolean;
  apiKey: string;
}

export const DEFAULT_SETTINGS: MySettings = {
  enabled: true,
  apiKey: "",
};
```

**commands/index.ts**:

```ts
import { Plugin } from "obsidian";
import { doSomething } from "./my-command.ts";

export function registerCommands(plugin: Plugin) {
  plugin.addCommand({
    id: "do-something",
    name: "Do something",
    callback: () => doSomething(plugin),
  });
}
```

### Add a command

```ts
this.addCommand({
  id: "your-command-id",
  name: "Do the thing",
  callback: () => this.doTheThing(),
});
```

### Persist settings

```ts
interface MySettings { enabled: boolean }
const DEFAULT_SETTINGS: MySettings = { enabled: true };

async onload() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  await this.saveData(this.settings);
}
```

### Register listeners safely

```ts
this.registerEvent(this.app.workspace.on("file-open", (f) => {/* ... */}));
this.registerDomEvent(window, "resize", () => {/* ... */});
this.registerInterval(window.setInterval(() => {/* ... */}, 1000));
```

## Troubleshooting

- Plugin doesn't load after build: ensure `main.js` and `manifest.json` are at
  the top level of the plugin folder under
  `<Vault>/.obsidian/plugins/<plugin-id>/`.
- Build issues: if `main.js` is missing, run `deno task build` or
  `deno task dev` to compile your TypeScript source code.
- Commands not appearing: verify `addCommand` runs after `onload` and IDs are
  unique.
- Settings not persisting: ensure `loadData`/`saveData` are awaited and you
  re-render the UI after changes.
- Mobile-only issues: confirm you're not using desktop-only APIs; check
  `isDesktopOnly` and adjust.

## References

- Obsidian sample plugin: https://github.com/obsidianmd/obsidian-sample-plugin
- API documentation: https://docs.obsidian.md
- Developer policies: https://docs.obsidian.md/Developer+policies
- Plugin guidelines:
  https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
- Style guide: https://help.obsidian.md/style-guide
