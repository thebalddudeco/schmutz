export function marketplaceLink(value, marketplace) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    if (marketplace === 'etsy' && ['etsy.com', 'www.etsy.com'].includes(url.hostname) && /^\/listing\/[^/]+/.test(url.pathname)) return url.href;
    if (marketplace === 'gumroad' && (url.hostname === 'gumroad.com' || url.hostname.endsWith('.gumroad.com')) && /^\/l\/[^/]+/.test(url.pathname)) return url.href;
  } catch {}
  return null;
}

export function productLinks(product, license = 'personal') {
  const etsyUrl = license === 'commercial' ? product.commercialEtsyUrl : product.etsyUrl;
  const gumroadUrl = license === 'commercial' ? product.commercialGumroadUrl : product.gumroadUrl;
  return [
    { label: 'Etsy', url: marketplaceLink(etsyUrl, 'etsy') },
    { label: 'Gumroad', url: marketplaceLink(gumroadUrl, 'gumroad') }
  ].filter(link => link.url);
}
