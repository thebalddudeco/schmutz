window.GEDData = window.GEDData || {};

window.GEDData.orderAccessRegistry = {
  sellerName: "Schmutz",
  productName: "GED Prep Hub by Schmutz",
  supportEmail: "info@thebalddude.co",
  instructions:
    "Use the same email address used at checkout and the Gumroad order ID shown on your receipt.",
  activeOrders: [
    { id: "owner-test-order", hash: "ac823be2d1f8dcfa3a4a5e10afc381741f251cd050209e31024ed4647c342d4b", note: "Owner test access" },
    { id: "owner-gumroad-test-2026-11-23", hash: "84c65ff0cf8e4cf83d696d1ea03715520952e25779d8a6d30917dfd784197fd0", note: "Gumroad creator test purchase (2026-11-23)" },
    { id: "owner-gumroad-test-receipt-2026-11-23", hash: "c05880bb20bdac530d80f7d57e03b59dab72cda80f5dabc1b18aa6f0542ffaec", note: "Gumroad creator test receipt shared by owner" },
  ],
  revokedOrderHashes: [
    // Paste hashes here to revoke access later.
    // A revoked hash will fail even if it still appears in activeOrders.
  ]
};
