# kuchbhiopinion-website

Website for **Kuch Bhi Opinion (KBO)** — [kuchbhiopinion.com](https://kuchbhiopinion.com/).

A one-page static site: plain HTML, CSS and vanilla JavaScript. No framework, no build step, no backend, no trackers.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | The whole page: header, hero, Latest Shorts, Memes, Follow, Contact, footer, meme lightbox |
| `styles.css` | All styles (mobile-first, dark theme) |
| `script.js` | Footer year, mobile menu, meme lightbox |
| `assets/brand/` | Logos and square profile image (also used for sharing previews) |
| `assets/memes/` | The 10 meme posts shown in the gallery (4:5) |
| `assets/icons/` | Favicon (32 px) and apple-touch-icon (180 px) |
| `favicon.ico` | Browser tab icon (16, 32, 48 px) |
| `robots.txt`, `sitemap.xml` | For search engines |
| `CNAME` | Custom domain for GitHub Pages (`kuchbhiopinion.com`) |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## Preview on your computer

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in a browser. Stop the server with `Ctrl + C`.

Use the local server rather than double-clicking `index.html`: the YouTube embed shows "Error 153" when the page is opened as a file.

## Adding a new meme

1. Save the image as a 4:5 PNG (1080 × 1350) in `assets/memes/`, named like `11_Short_Title.png`.
2. In `index.html`, copy one `<li>` in the `meme-grid` list and change the file name (twice) and the `alt` text.

## Changing the Short

In `index.html`, find `youtube-nocookie.com/embed/` and replace the video ID (the part after `/shorts/` in the YouTube link). Update the `title` too.

## Deploy with GitHub Pages

Once only (already prepared in this repo: `CNAME` and `.nojekyll`):

1. On GitHub: **Settings → Pages**.
2. **Source:** "Deploy from a branch". **Branch:** `main`, folder `/ (root)`. Save.
3. **Custom domain:** `kuchbhiopinion.com`. Save.
4. At the domain registrar (GoDaddy → Domain → DNS), set:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | peeyushkumar9.github.io |

   Remove any other A record for `@` (for example GoDaddy's parking record) and any domain forwarding.
5. Back in **Settings → Pages**, wait for the DNS check to pass and the certificate to be issued, then tick **Enforce HTTPS**.

After that, every merge into `main` publishes automatically within a minute or two.
