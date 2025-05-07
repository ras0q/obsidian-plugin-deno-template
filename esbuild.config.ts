import esbuild from "esbuild";
import $ from "@david/dax";

const prod = Deno.args[0] === "production";

const rootDir = $.path(import.meta.dirname!);
const pluginName = rootDir.basename().replace(/^obsidian-?/, "");
const vaultDir = rootDir.join(`vault-for-${pluginName}`);
if (!vaultDir.existsSync()) {
  await $`git clone --depth 1 https://github.com/kepano/kepano-obsidian.git ${vaultDir}`;
  await $`echo ${vaultDir.basename()} >> .gitignore`;
}

const distDir = prod
  ? rootDir.join("dist")
  : vaultDir.join(".obsidian", "plugins", pluginName);
if (!distDir.existsSync()) {
  await $`mkdir -p ${distDir}`;
}

const context = await esbuild.context({
  entryPoints: ["main.ts", "styles.css", "manifest.json"],
  outdir: distDir.toString(),
  bundle: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/collab",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/lint",
    "@codemirror/search",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  minify: prod,
  loader: {
    ".css": "copy",
    ".json": "copy",
  },
});

if (prod) {
  await context.rebuild();
  Deno.exit(0);
} else {
  await context.watch();
}
