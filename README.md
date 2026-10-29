# kuchbhiopinion-website

Website for **Kuch Bhi Opinion (KBO)** — [kuchbhiopinion.com](https://kuchbhiopinion.com/).

A static site built with **Jekyll as built in to GitHub Pages** (GitHub builds it; nothing to install online). Plain HTML, CSS and vanilla JavaScript on the page itself. No framework, no backend, no trackers. Home page, auto-updating meme gallery, blog with authors, RSS feed.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home page (hero, scroll words, Meme Corner, KBO Kids News, latest articles, Follow) |
| `_layouts/` | `default.html` (page shell) and `post.html` (article page) |
| `_includes/` | Floating menu, ticker, footer, icons, lightbox, Short pop-up, meme rows/grid, article clippings |
| `_config.yml` | Site title, URL, plugins (`jekyll-feed`, `jekyll-sitemap`, `jekyll-seo-tag`) |
| `_posts/` | Articles (Markdown) |
| `_data/authors.yml` | Authors (name, one-line bio, optional photo) |
| `_data/ticker.yml` | The jokes in the orange BREAKING ticker under the menu |
| `memes/index.html` | The full meme gallery at `/memes/` (the home page shows the latest 10 in two sliding rows) |
| `blog/index.html`, `authors/index.html` | The Blog page and the Authors page |
| `styles.css`, `script.js` | All styles and behaviour (menu, lightbox, "Load more", copy link) |
| `assets/brand/` | Logos and square profile image (also used for sharing previews) |
| `assets/memes/` | Meme images; the gallery is built from this folder automatically |
| `assets/blog/`, `assets/authors/` | Article cover images and author photos |
| `assets/icons/`, `favicon.ico` | Favicons |
| `.pages.yml` | Pages CMS setup (browser forms for articles, authors and uploads) |
| `robots.txt` | For search engines (`sitemap.xml` and `feed.xml` are generated) |
| `CNAME` | Custom domain for GitHub Pages (`kuchbhiopinion.com`) |

## Preview on your computer

Jekyll turns the files into the site, so the plain `python3 -m http.server` no longer shows the finished page. Once only: install Ruby and Bundler, then in this folder run:

```bash
bundle install
```

Every time you want to preview:

```bash
bundle exec jekyll serve
```

Open <http://localhost:4000>. Stop with `Ctrl + C`. (If you see an encoding error, run `export LANG=C.UTF-8` first.) The YouTube embed needs a real web address, so always preview through the server and not by double-clicking a file.

## How to publish an article / add a meme / add an author

Anyone other than the site owner works through a **pull request** (Pages CMS creates it for you). The owner approves and merges; nothing goes live without that. Keep everything non-political and original.

### Easiest way: Pages CMS (browser form)

1. Open <https://app.pagescms.org> and sign in with GitHub. The owner invites writers to the repository.
2. Choose this repository. You will see **Articles**, **Authors** and the media folders.

### Publish an article

1. In Pages CMS: **Articles → Add an entry**. Fill title, **author id** (see the Authors list), date, cover image (1200 × 630), tags, short summary, and write the article.
2. Save. Writers other than the owner: save to a new branch and open a pull request. The owner merges it.
3. About a minute after merging, the article is live on `/blog/` and in the RSS feed (`/feed.xml`).

Without Pages CMS: add a file to `_posts/` named `YYYY-MM-DD-short-title.md`, copy the top block ("front matter") from `_posts/2026-10-28-sample-article.md` and change it, then write below it. The sample article is only an example; delete it when real articles exist.

### Add a meme

1. Make a 4:5 image (1080 × 1350 px, PNG).
2. Name it `YYYY-MM-DD-short-name.png` (for example `2026-11-02-chai-break.png`). The date decides the order (newest first); the words after the date become the caption.
3. Upload it to `assets/memes/` (Pages CMS: **Memes → Upload**, or GitHub: *Add file → Upload files*). That is all: no code to edit. The gallery shows 12 memes and a "Load more" button for the rest.

### Change the ticker jokes

Edit `_data/ticker.yml` (Pages CMS: **Ticker**). Each item has a `tag` (the black label, such as Breaking, Live, Exclusive) and a `text` (the joke). Add, remove or reorder items; the ticker updates by itself. Keep it non-political.

### Add an author

1. Pages CMS: **Authors → add an item**, or edit `_data/authors.yml` and add a block:

   ```yaml
   - id: priya
     name: Priya
     bio: "Chai, memes aur Monday ki shikayat."
     photo: /assets/authors/priya.jpg   # optional
   ```
2. In that author's articles, write `author: priya` in the front matter (the Pages CMS form has an *Author id* field).
3. Authors appear on `/authors/`; each article links to its writer there.

> The Pages CMS settings in `.pages.yml` were written from its documentation and have not been tried against the live service. If a form field looks wrong, the plain file way above always works.

## Local checks before opening a pull request

Run `bundle exec jekyll build` (it must finish without errors), look at the home page, Blog, an article and Authors at phone width (about 390 px) and desktop width (about 1366 px), and make sure the browser console is clean.

## Changing the Short

The Short is played from the phone in the KBO Kids News block. Change the video ID (the part after `/shorts/` in the YouTube link) in two places: `data-src` in `_includes/short-dialog.html` and the `href` of the play button (`data-short`) in `index.html`. Update the `title` in the dialog too.

## Deploy with GitHub Pages

Once only (already prepared in this repo: `CNAME` and the Jekyll setup; there is no `.nojekyll` any more, so GitHub builds the site):

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
