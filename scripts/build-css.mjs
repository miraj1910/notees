import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const stylesDir = path.join(root, "src", "styles");
const outPath = path.join(root, "style.css");

const files = ["globals.css", "layout.css", "components.css", "responsive.css"];

const parts = files.map((f) => {
  const filePath = path.join(stylesDir, f);
  return fs.readFileSync(filePath, "utf-8");
});

fs.writeFileSync(outPath, parts.join("\n\n"), "utf-8");
console.log(`\u2713 Concatenated ${files.length} CSS files -> style.css`);
