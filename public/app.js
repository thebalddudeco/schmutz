import { productLinks } from './marketplaces.js';
const grid = document.querySelector('#products');
const search = document.querySelector('#search');
const dialog = document.querySelector('#product-dialog');
let products = [], category = 'all';
const validImage = value => typeof value === 'string' && (/^assets\/[a-z0-9._/-]+$/i.test(value) || /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value));
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function openProduct(p) {
  const content = document.querySelector('#dialog-content'); content.replaceChildren();
  const layout = el('div','dialog-grid'); const img = el('img'); img.src = validImage(p.image) ? p.image : 'assets/favicon.svg'; img.alt = p.name + ' design preview';
  const info = el('div'); info.append(el('span','eyebrow', p.category), el('h2','',p.name), el('p','',p.description),el('div','specs',`Application / format: ${p.format}`));
  const licenses = el('div', 'license-options');
  const purchaseOptions = p.licenseMode === 'single' ? [['personal', 'Canva template', 'Editable Canva template access. Choose your preferred store below.']] : [
    ['personal', 'Personal Use', 'For your own personal projects.'],
    ['commercial', 'Commercial Use', 'For business and client projects.']
  ];
  for (const [type, title, description] of purchaseOptions) {
    const option = el('section', 'license-option');
    const heading = el('div', 'license-heading');
    heading.append(el('h3', '', title));
    const price = type === 'personal' ? (p.personalPrice || p.price) : p.commercialPrice;
    if (price && !p.sample) heading.append(el('span', '', price));
    option.append(heading, el('p', '', description));
    const links = productLinks(p, type);
    if (links.length && !p.sample) {
      const actions = el('div', 'purchase-links');
      for (const { label, url } of links) {
        const link = el('a', 'button', `Buy on ${label}`);
        link.setAttribute('aria-label', `Buy ${p.name}, ${title}, on ${label}`);
        link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; actions.append(link);
      }
      option.append(actions);
    } else option.append(el('span', 'unavailable', 'Coming soon'));
    licenses.append(option);
  }
  info.append(licenses, el('p', 'license-note', 'Review the full license terms on the product listing before purchasing.'));
  if (p.sample) info.append(el('span', 'unavailable', 'Sample concept. Not available for purchase.'));
  layout.append(img,info);content.append(layout);dialog.showModal();
}
function render() {
  const term = search.value.trim().toLowerCase();
  const visible = products.filter(p => (category === 'all' || p.category === category) && `${p.name} ${p.category} ${p.format} ${p.description}`.toLowerCase().includes(term));
  grid.replaceChildren();
  visible.forEach(p => {
    const card = el('article','product'), button = el('button','product-open');button.setAttribute('aria-label',`Preview ${p.name}`);
    const art = el('div','art-wrap'), img = el('img');img.src=validImage(p.image)?p.image:'assets/favicon.svg';img.alt=p.name+' template artwork';img.loading='lazy';img.width=900;img.height=650;
    art.append(img, el('span','art-arrow','→'));if(p.sample) art.append(el('span','sample','SAMPLE CONCEPT'));
    const info=el('div','product-info'), title=el('div');title.append(el('h3','',p.name),el('p','',`${p.category} / ${p.format}`));info.append(title,el('span','price',p.sample?'COMING SOON':(p.price || p.personalPrice || 'VIEW ON ETSY')));button.append(art,info);button.addEventListener('click',()=>openProduct(p));card.append(button);if(!p.sample){const actions=el('div','product-purchase-links');for(const {label,url} of productLinks(p)){const buy=el('a','product-buy',`Buy on ${label} ↗`);buy.href=url;buy.target='_blank';buy.rel='noopener noreferrer';buy.setAttribute('aria-label',`Buy ${p.name} on ${label}`);actions.append(buy);}card.append(actions);}grid.append(card);
  });
  document.querySelector('#empty').hidden = visible.length > 0;
  document.querySelector('#results-status').textContent=`${visible.length} templates shown`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
document.querySelectorAll('.search-toggle').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#search-panel').hidden=false;document.querySelector('#shop').scrollIntoView();search.focus({preventScroll:true});}));
search.addEventListener('input',render);document.querySelector('#clear-search').addEventListener('click',()=>{search.value='';render();search.focus();});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
try { const response=await fetch('catalog.json?v=stores-20261029');if(!response.ok)throw new Error('Catalog unavailable');products=await response.json();if(!Array.isArray(products))throw new Error('Invalid catalog');document.querySelector('[data-filter=all] sup').textContent=String(products.length).padStart(2,'0');document.querySelector('.catalog-note').hidden=false;render(); } catch {grid.textContent='The catalog could not load. Please refresh and try again.';}
