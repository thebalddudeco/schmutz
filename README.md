# Schmutz

Original storefront for schmutz.pro. Static HTML, CSS, and JavaScript with no dependencies. Includes six clearly labeled concept products, responsive layouts, category filtering, search, product previews, and a browser-local catalog editor.

## Preview

Run `npm run dev`, then open http://127.0.0.1:4173. Run `npm run check` and `npm run build` to validate and prepare `dist/`.

## Add products

Open `/studio.html`. Add a product, upload a cover, fill in the description and software format, and paste its Etsy listing URL. Turn off Sample when the real product is available. Save the draft and Export catalog. Replace `public/catalog.json` with the downloaded file and commit it. Images are embedded in the exported catalog. Larger collections should use optimized files in `public/assets` and relative image paths instead.

The studio is a local editing utility. It does not upload to a server or commit to GitHub. Anyone can open the editor but cannot change the published site without repository access. Unsaved form edits are discarded when switching products; use Save draft first. Template downloads and checkout are handled by Etsy, not this site.

## GitHub deployment

Create or use a GitHub repository. Push this project to its `main` branch. In Settings > Pages, set Source to GitHub Actions. The included workflow validates, builds, and deploys the site. In Pages settings, set Custom domain to `schmutz.pro`, verify the domain, and enable HTTPS after GitHub provisions the certificate. Existing DNS has not been inspected or changed. No CNAME file is added until the intended repository and domain assignment are confirmed.

## Design

Black and warm white, editorial serif typography, italic accents, oversized wordmark, small utility typography, orange section, and colorful original SVG product covers. System fonts and local artwork keep the site independent of third-party font or image services. Sample artwork can be regenerated with `node scripts/artwork.mjs`.

## Before launch

Replace sample concepts with actual products and listing links. Confirm software compatibility and license terms on each listing. There is no connected newsletter, checkout backend, hosted upload service, or account system in this version.
