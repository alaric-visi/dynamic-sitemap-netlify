// /netlify/functions/sitemap.js
// Generates sitemap.xml on demand using the HTML files bundled with the function.
// Requires the "included_files" setting in netlify.toml so the pages are available
// at runtime. Works for plain‑HTML sites with pages in the repo root and /posts/.

import fs from "fs";
import path from "path";

// The root of the deployed Lambda bundle (HTML files land here thanks to included_files)
const PUBLISH_DIR = process.cwd();

// Handle production, deploy‑preview, and local dev URLs
const CANONICAL_BASE = (process.env.URL || process.env.DEPLOY_PRIME_URL || "https://example.netlify.app").replace(/\/$/, "");

// Recursively collect every file beneath dir
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    entry.isDirectory() ? files.push(...walk(full)) : files.push(full);
  }
  return files;
}

export const handler = async () => {
  try {
    const pages = walk(PUBLISH_DIR)
      .filter((f) => f.endsWith(".html"))
      .map((f) =>
        f
          .replace(PUBLISH_DIR, "")   // drop absolute path
          .replace(/index\.html$/, "/")  // “/blog/index.html” → “/blog/”
          .replace(/\.html$/, "")        // “/about.html” → “/about”
      );

    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((p) => `  <url><loc>${CANONICAL_BASE}${p}</loc></url>`)
      .join("\n")}\n</urlset>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
      body: xmlBody,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: `Sitemap generation failed: ${error.message}`,
    };
  }
};
