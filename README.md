# Schmutz

Original storefront for schmutz.pro. Static HTML, CSS, and JavaScript with no dependencies. Includes six clearly labeled concept products, responsive layouts, category filtering, search, product previews, and a browser-local catalog editor.

## Preview

Run `npm run dev`, then open http://127.0.0.1:4173. Run `npm run check` and `npm run build` to validate and prepare `dist/`.

## Add products

Open `/studio.html`. Add a product, upload a cover, fill in the description and software format, and paste its Etsy and/or Gumroad product URLs. Set separate Personal Use and Commercial Use prices and product links. Each license can link to either store or both, and both licenses need at least one link before a product can leave sample mode. Turn off Sample when the real product is available. Save the draft and Export catalog. Replace `public/catalog.json` with the downloaded file and commit it. Images are embedded in the exported catalog. Larger collections should use optimized files in `public/assets` and relative image paths instead.

The studio is a local editing utility. It does not upload to a server or commit to GitHub. Anyone can open the editor but cannot change the published site without repository access. Unsaved form edits are discarded when switching products; use Save draft first. Template downloads and checkout are handled by Etsy or Gumroad, not this site.

## GitHub deployment

Create or use a GitHub repository. Push this project to its `main` branch. In Settings > Pages, set Source to GitHub Actions. The included workflow validates, builds, and deploys the site. In Pages settings, set Custom domain to `schmutz.pro`, verify the domain, and enable HTTPS after GitHub provisions the certificate. Existing DNS has not been inspected or changed. The public/CNAME file declares schmutz.pro. The GitHub repository is https://github.com/thebalddudeco/schmutz. Publishing and DNS changes are pending upload access.

## Design

Black and warm white, editorial serif typography, italic accents, oversized wordmark, small utility typography, orange section, and colorful original SVG product covers. System fonts and local artwork keep the site independent of third-party font or image services. Sample artwork can be regenerated with `node scripts/artwork.mjs`.

## Before launch

Replace sample concepts with actual products and listing links. Confirm software compatibility and license terms on each listing. There is no connected newsletter, checkout backend, hosted upload service, or account system in this version.

## Brand system

The approved SVG, WebP and ICO package is in `public/brand/approved/`. The matching logo, icon, favicon and social exports also populate their named folders under `public/brand/`. Original user-supplied masters remain untouched in `public/brand/NEW ASSETS/`. The current overview is `public/brand/brand-overview.webp`.

Do not run the legacy `scripts/brand-kit.py`: it generates superseded artwork. The approved export helper and all temporary work from the earlier chat are preserved in `_migration/previous-chat/`. Read `PROJECT-HANDOFF.txt` for the detailed decisions and remaining work. Historical status in that handoff describes the prior session; this session has verified write access and applied the website patch.

## Consolidation on October 21, 2026

Canonical project folder: `A:\Schmutz`. Git history is restored here. The approved website patch and latest exports, including Frame 18, are applied. `_migration/2026-10-21-before-consolidation/` preserves the earlier site and build. `_migration/previous-chat/` preserves the previous temporary exports, generators, ZIPs, and handoff. These local archives are excluded from Git and the website build.

Remaining work: pattern replacements and additional social layouts were not completed in the earlier chat; the original patterns are preserved. GitHub publishing, domain connection, and real product listings are still pending. Consolidating local files does not publish the website.
