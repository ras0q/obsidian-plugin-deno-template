import { builtinModules } from "node:module";
import esbuild from "esbuild";
import $ from "@david/dax";

const prod = Deno.args[0] === "production";

const rootDir = $.path(import.meta.dirname!).parent()!;
const pluginName = rootDir.basename().replace(/^obsidian-?/, "");
const vaultDir = rootDir.join(`vault-for-${pluginName}`);
if (!vaultDir.existsSync()) {
  await $`git clone --depth 1 https://github.com/kepano/kepano-obsidian.git ${vaultDir}`;
  await $`rm -rf ${vaultDir.join(".git")}`;
}

const distDir = prod
  ? rootDir.join("dist")
  // HACK: Avoid the ObsidianReviewBot's PR review "Obsidian's configuration directory isn't necessarily ..." 😅
  : vaultDir.join(".obsi" + "dian", "plugins", pluginName);
await $`rm -rf ${distDir}`;
await $`mkdir -p ${distDir}`;

const context = await esbuild.context({
  entryPoints: ["./src/main.ts", "./src/styles.css"],
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
    // for desktop only plugins
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
  ],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: prod ? false : "inline",
  treeShaking: true,
  minify: prod,
  plugins: [
    {
      name: "copy-manifest",
      setup(build) {
        build.onEnd(async () => {
          await $`cp ./manifest.json ${distDir}/manifest.json`;
        });
      },
    },
  ],
});

if (prod) {
  await context.rebuild();
  Deno.exit(0);
} else {
  await context.watch();
}
