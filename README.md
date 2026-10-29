# Schmutz

Original storefront for schmutz.pro. Static HTML, CSS, and JavaScript with no dependencies. Includes eight live Etsy Canva products, responsive layouts, category filtering, search, product previews, and a browser-local catalog editor.

## Preview

Run `npm run dev`, then open http://127.0.0.1:4173. Run `npm run check` and `npm run build` to validate and prepare `dist/`.

## Add products

Open `/studio.html`. Add a product, upload a cover, fill in the description and software format, and paste its Etsy and/or Gumroad product URLs. The current products use one Etsy purchase option and the terms from their listing. Legacy products may use separate Personal Use and Commercial Use prices and product links. Each license can link to either store or both, and single-purchase products need one link; separate-license products need a link for each license before leaving sample mode. Turn off Sample when the real product is available. Save the draft and Export catalog. Replace `public/catalog.json` with the downloaded file and commit it. Images are embedded in the exported catalog. Larger collections should use optimized files in `public/assets` and relative image paths instead.

The studio is a local editing utility. It does not upload to a server or commit to GitHub. Anyone can open the editor but cannot change the published site without repository access. Unsaved form edits are discarded when switching products; use Save draft first. Template downloads and checkout are handled by Etsy or Gumroad, not this site.

## GitHub deployment

The site is published from the `gh-pages` branch of https://github.com/thebalddudeco/schmutz. GitHub Pages uses the generated static files at the branch root; `public/CNAME` keeps the custom domain set to `schmutz.pro`. The domain's apex A and AAAA records point to GitHub Pages, and `www` is a CNAME to `thebalddudeco.github.io`. GitHub's certificate provisioning and HTTPS enforcement are the final launch checks. To publish a future update, run `npm run check` and `npm run build`, then publish the contents of `dist/` to `gh-pages` (including `CNAME`).

## Design

Black and warm white, editorial serif typography, italic accents, oversized wordmark, small utility typography, orange section, and colorful original SVG product covers. System fonts and local artwork keep the site independent of third-party font or image services. Sample artwork can be regenerated with `node scripts/artwork.mjs`.

## Before launch

The concept catalog has been replaced with eight Etsy template listings, verified active on October 29, 2026. Confirm software compatibility and license terms on each listing. There is no connected newsletter, checkout backend, hosted upload service, or account system in this version.

## Brand system

The approved SVG, WebP and ICO package is in `public/brand/approved/`. The matching logo, icon, favicon and social exports also populate their named folders under `public/brand/`. Original user-supplied masters remain untouched in `public/brand/NEW ASSETS/`. The current overview is `public/brand/brand-overview.webp`.

Do not run the legacy `scripts/brand-kit.py`: it generates superseded artwork. The approved export helper and all temporary work from the earlier chat are preserved in `_migration/previous-chat/`. Read `PROJECT-HANDOFF.txt` for the detailed decisions and remaining work. Historical status in that handoff describes the prior session; this session has verified write access and applied the website patch.

## Consolidation on October 21, 2026

Canonical project folder: `A:\Schmutz`. Git history is restored here. The approved website patch and latest exports, including Frame 18, are applied. `_migration/2026-10-21-before-consolidation/` preserves the earlier site and build. `_migration/previous-chat/` preserves the previous temporary exports, generators, ZIPs, and handoff. These local archives are excluded from Git and the website build.

Remaining work: pattern replacements and additional social layouts were not completed in the earlier chat; the original patterns are preserved. The site and DNS are connected; GitHub certificate provisioning and HTTPS enforcement are being verified. Real product listings still need to replace the sample concepts. Consolidating local files does not publish the website.
