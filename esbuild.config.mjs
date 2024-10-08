import * as esbuild from "esbuild";

await esbuild.build({
  bundle: true,
  outfile: "dist/js",
});
