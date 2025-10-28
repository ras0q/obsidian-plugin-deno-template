# Obsidian Plugin Template (with Deno)

This is a sample plugin for [Obsidian](https://obsidian.md).

You can use [Deno](https://deno.com) for almost everything in development!

- Runtime: **Deno**
- Formatter: **Deno**
- Linter: **Deno** + **ESLint** (with `eslint-plugin-obsidianmd`)
- Type Checker: **Deno**
- Bundler: **esbuild** (`deno bundle` is back in v2.4, but lack of features)

See
[obsidianmd/obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
for details.

## Setup

**To simplify the explanation, we assume the plugin name is `my-feature`.**

1. Create a new repository `<yourname>/obsidian-my-feature` from this template
2. Clone the repository
3. Rename variables in `manifest.json` and `main.ts`
   - `id` should be `my-feature` (DON'T include `obsidian-` prefix)
   - `name` should be `My Feature`
   - The plugin class name should be `MyFeaturePlugin`

## Development

Want to contribute to this repository? Thank you!

Please see [CONTRIBUTING.md](./CONTRIBUTING.md).
