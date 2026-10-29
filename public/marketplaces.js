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
  const checkoutUrl = license === 'commercial' ? product.commercialGumroadCheckoutUrl : product.gumroadCheckoutUrl;
  return [
    { label: 'Etsy', url: marketplaceLink(etsyUrl, 'etsy') },
    { label: 'Gumroad', url: gumroadCheckoutLink(checkoutUrl) || marketplaceLink(gumroadUrl, 'gumroad') }
  ].filter(link => link.url);
}

export function gumroadCheckoutLink(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'gumroad.com' || url.username || url.password || url.pathname !== '/checkout' || url.hash) return null;
    if (!/^[a-zA-Z0-9]+$/.test(url.searchParams.get('product') || '') || url.searchParams.get('quantity') !== '1') return null;
    if ([...url.searchParams.keys()].some(key => !['product', 'quantity'].includes(key))) return null;
    return url.href;
  } catch { return null; }
}
