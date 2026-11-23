window.GEDData = window.GEDData || {};

window.GEDData.orderAccessRegistry = {
  sellerName: "Schmutz",
  productName: "GED Prep Hub by Schmutz",
  supportEmail: "info@thebalddude.co",
  instructions:
    "Use the same email address used at checkout and the Gumroad order ID shown on your receipt.",
  activeOrders: [
    { id: "owner-test-order", hash: "ac823be2d1f8dcfa3a4a5e10afc381741f251cd050209e31024ed4647c342d4b", note: "Owner test access" },
    { id: "owner-gumroad-test-2026-11-23", hash: "717849e5d0c134460e664954ab750c9b2645723e55aae0fd8041c166a8969d3b", note: "Gumroad creator test purchase (2026-11-23)" }
  ],
  revokedOrderHashes: [
    // Paste hashes here to revoke access later.
    // A revoked hash will fail even if it still appears in activeOrders.
  ]
};
