# dynamic-sitemap-netlify

# Dynamic sitemap for a static Netlify site

Generates **`/sitemap.xml` on-the-fly** from the HTML files that Netlify bundles at deploy-time.  
Ideal for plain HTML sites whose pages live in the repo root or in `/posts/`.

---

## How it works

| File | Purpose |
| --- | --- |
| **`netlify/functions/sitemap.js`** | Lambda function that walks the publish directory, lists every `.html`, converts paths to clean URLs, and returns an XML sitemap. |
| **`netlify.toml`** | • Tells Netlify to copy HTML files into the function bundle via `included_files`.<br>• Redirects requests for `/sitemap.xml` to the function.<br>• Standard build settings (`publish` + `functions`). |

At runtime the function builds a canonical base URL from `URL` or `DEPLOY_PRIME_URL`, so previews and production all serve the correct links.

---

## Quick start

1. Copy the two files into your project.
2. Adjust `included_files` if your pages live elsewhere.
3. Deploy to Netlify (or run `netlify dev` locally).
4. Visit **`/sitemap.xml`** – you should see a fresh sitemap with every page.

---

## Notes

* Works with Node 18 (the default on Netlify as of 2025).
* No external dependencies; only the core `fs` and `path` modules.
* Feel free to tweak the URL filter to include/exclude sections as required.

---
