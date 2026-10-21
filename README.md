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

Open `/brand/` for the visual guide and `/downloads/schmutz-brand-kit.zip` for the package. Includes outlined SVG and transparent PNG logos, monograms, 24 original utility icons, SVG sprite, favicon files, social assets, swatches, design tokens, and an original Schmutz Symbols TTF/WOFF font. Georgia and Arial text font binaries are not bundled. `python scripts/brand-kit.py` regenerates artwork from locally installed fonts; the guide files are maintained separately.
