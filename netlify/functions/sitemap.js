import fs from "fs";
import path from "path";

const CANONICAL_BASE =
  process.env.URL || process.env.DEPLOY_PRIME_URL;

// __dirname points to the root of the function bundle
const PUBLISH_DIR = path.join(__dirname);

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    fs.statSync(full).isDirectory()
      ? walk(full, list)
      : list.push(full);
  }
  return list;
}

export const handler = async () => {
  try {
    const pages = walk(PUBLISH_DIR)
      .filter(f => f.endsWith(".html"))
      .map(f =>
        f
          .replace(PUBLISH_DIR, "")
          .replace(/index\.html$/, "/")
          .replace(/\.html$/, "")
      );

    const xml = `\n\n${pages
      .map((p) => `  ${CANONICAL_BASE}${p}`)
      .join("\n")}\n`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=0, must-revalidate",
      }
      body: xml,
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};