import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

function get(key, fallback = "") {
  return process.env[key] || fallback;
}

loadEnv();

const CLIENT_ID = get("GOOGLE_CLIENT_ID");
const SCOPES = get("GOOGLE_SCOPES", "https://www.googleapis.com/auth/drive.file");
const APP_NAME = get("APP_NAME", "Blackline Notes");
const APP_ENV = get("APP_ENV", "development");
const APP_VERSION = get("APP_VERSION", "0.1.0");

const output = `// This file is auto-generated from .env. Do not edit manually.

export const env = {
  CLIENT_ID: ${JSON.stringify(CLIENT_ID)},
  SCOPES: ${JSON.stringify(SCOPES)},
  APP_NAME: ${JSON.stringify(APP_NAME)},
  APP_ENV: ${JSON.stringify(APP_ENV)},
  APP_VERSION: ${JSON.stringify(APP_VERSION)},
} as const;
`;

const outPath = path.join(root, "src", "config", "env.ts");
fs.writeFileSync(outPath, output, "utf-8");
console.log(`\u2713 Generated src/config/env.ts`);
