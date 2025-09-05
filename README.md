# Obsidian Plugin Template (with Deno)

This is a sample plugin for [Obsidian].

You can use [Deno] for almost everything in development!

- Runtime: **Deno**
- Formatter: **Deno**
- Linter: **Deno** + **ESLint** (with `eslint-plugin-obsidianmd`)
- Type Checker: **Deno**
- Bundler: **esbuild** (`deno bundle` is back in v2.4, but lack of features)

See [obsidianmd/obsidian-sample-plugin] for details.

## Setup

**To simplify the explanation, we assume the plugin name is `my-feature`.**

1. Create a new repository `<yourname>/obsidian-my-feature` from this template
2. Clone the repository
3. Rename variables in `manifest.json` and `main.ts`
   - `id` should be `my-feature` (DON'T include `obsidian-` prefix)
   - `name` should be `My Feature`
   - The plugin class name should be `MyFeaturePlugin`

## Development

1. Install [Deno]
2. Run `deno task dev`, which will:
   - Clone the [sample vault] to `./vault-for-my-feature`
   - Build the plugin with live reload
3. Open the sample vault in Obsidian
4. Enable the plugin in Obsidian settings

### IDE Integration

VSCode / Cursor

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

## Release

```bash
deno task bump [patch | minor | major]
```

[Obsidian]: https://obsidian.md
[Deno]: https://deno.com
[obsidianmd/obsidian-sample-plugin]: https://github.com/obsidianmd/obsidian-sample-plugin
[sample vault]: https://github.com/kepano/kepano-obsidian
