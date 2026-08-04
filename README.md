# Jayanth M — Personal Portfolio

Production-ready personal portfolio for **Jayanth M**, Senior Cloud & DevOps Engineer.

Built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. No frameworks. Deployable directly to **Cloudflare Pages**.

## Features

- Resume-driven Cloud/DevOps portfolio (AWS · Kubernetes · GitOps · Observability)
- Animated infrastructure architecture hero (CI/CD → EKS → Cloudflare)
- Userfacet shown as DevOps Engineer then Senior (internal promotion)
- Monitoring & Observability section with live-style dashboards
- Sticky glass nav, dark/light mode, floating contact icons (no GitHub)
- Typing, counters, skill bars, timeline animations, resume modal
- SEO: Open Graph, Twitter Card, JSON-LD, canonical, `robots.txt`, `sitemap.xml`
- Deploy-ready for Cloudflare Pages & GitHub Pages

## Project structure

```
Portfolio/
├── index.html      # Main page
├── style.css       # Styles
├── script.js       # Interactions
├── resume.pdf      # Resume file
├── profile.jpg     # Profile photo
├── favicon.svg     # Favicon
├── robots.txt
├── sitemap.xml
└── README.md
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8080

# Node (if installed)
npx serve .
```

Visit `http://localhost:8080`.

## Upload to GitHub

```bash
cd /path/to/Portfolio
git init   # skip if already a repo
git add .
git commit -m "Add personal portfolio website"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

Replace `<YOUR_USERNAME>` and `<YOUR_REPO>` with your GitHub values.

## Deploy on Cloudflare Pages

1. Sign in at [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the GitHub repository.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` *(or leave default / empty for static root)*
4. Click **Save and Deploy**.
5. Your site will be live at `https://<project-name>.pages.dev`.

### Manual / Direct Upload

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Upload the project folder contents (`index.html`, `style.css`, `script.js`, assets, etc.).
3. Deploy.

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. Repo → **Settings** → **Pages**.
3. **Source:** Deploy from a branch.
4. Branch: `main` (or `master`) → folder `/ (root)` → **Save**.
5. Site URL: `https://<username>.github.io/<repo>/` (or custom domain).

`.nojekyll` is included so GitHub Pages serves static files as-is.

If the site is served from a subpath (`/<repo>/`), set relative asset paths (already relative) and update canonical / OG / sitemap URLs to the GitHub Pages URL.

## Update the resume later

1. Replace `resume.pdf` with your new PDF (keep the same filename).
2. Update matching content in `index.html` (hero summary, experience, skills, etc.).
3. Update `profile.jpg` if needed.
4. Commit and push — Cloudflare Pages redeploys automatically if connected to Git.

```bash
cp /path/to/new-resume.pdf ./resume.pdf
# edit index.html as needed
git add resume.pdf index.html
git commit -m "Update resume and portfolio content"
git push
```

## Connect a custom domain

1. Cloudflare Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter your domain (e.g. `jayanthm.dev`).
3. If the domain is on Cloudflare DNS, records are configured automatically.
4. If DNS is elsewhere, add the CNAME Cloudflare shows (usually pointing to `<project>.pages.dev`).
5. Wait for SSL provisioning.

After the domain is live, update these URLs to match:

- `index.html` — `canonical`, Open Graph, Twitter, JSON-LD
- `robots.txt` — Sitemap URL
- `sitemap.xml` — `<loc>` values

## Contact details (from resume)

| Field    | Value |
|----------|--------|
| Email    | jaygowda82@gmail.com |
| Phone    | +91 96329 32097 |
| LinkedIn | [linkedin.com/in/jayanth-m-113095374](https://www.linkedin.com/in/jayanth-m-113095374) |
| Location | Bengaluru, India |

## Notes

- Contact form is **UI-only** (no backend). Use email or LinkedIn for real messages.
- Default theme is dark; users can toggle light mode.
- For Lighthouse SEO, set real production URLs in meta tags and sitemap after deploy.
