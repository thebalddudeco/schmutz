# GED Prep Hub

Consolidated source for the Schmutz GED Prep Hub, migrated from the standalone `thebalddudeco/gedstudy` repository.

## Build and route

Editable source lives in `products/ged-prep/`. The Schmutz build copies only the runtime app, styles, study data, and cover art to `dist/ged-prep/`, served at https://schmutz.pro/ged-prep/. The Schmutz Tools listing links the separate GED membership tile to this route. The app links back to Schmutz Tools and to the GED Prep Hub Gumroad membership.

## Access limitation

This is a static browser app. The purchase check is a soft gate; the app and study-bank files are delivered to the visitor's browser. A manual allowlist cannot securely verify or revoke recurring Gumroad subscriptions. Secure membership enforcement requires a server-side entitlement check.

Seller helpers and project documentation stay out of the generated website output.
