const grid = document.querySelector('#products');
const search = document.querySelector('#search');
const dialog = document.querySelector('#product-dialog');
let products = [], category = 'all';
const validImage = value => typeof value === 'string' && (/^assets\/[a-z0-9._/-]+$/i.test(value) || /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value));
const etsyLink = value => { try { const u = new URL(value); return u.protocol === 'https:' && (u.hostname === 'etsy.com' || u.hostname === 'www.etsy.com') ? u.href : null; } catch { return null; } };
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function openProduct(p) {
  const content = document.querySelector('#dialog-content'); content.replaceChildren();
  const layout = el('div','dialog-grid'); const img = el('img'); img.src = validImage(p.image) ? p.image : 'assets/favicon.svg'; img.alt = p.name + ' design preview';
  const info = el('div'); info.append(el('span','eyebrow', p.category), el('h2','',p.name), el('p','',p.description),el('div','specs',`Application / format: ${p.format}`));
  const url = etsyLink(p.etsyUrl);
  if (url && !p.sample) { const link = el('a','button','View on Etsy ↗'); link.href=url;link.target='_blank';link.rel='noopener noreferrer';info.append(link); }
  else info.append(el('span','unavailable','Sample concept. Not available for purchase.'));
  layout.append(img,info);content.append(layout);dialog.showModal();
}
function render() {
  const term = search.value.trim().toLowerCase();
  const visible = products.filter(p => (category === 'all' || p.category === category) && `${p.name} ${p.category} ${p.format} ${p.description}`.toLowerCase().includes(term));
  grid.replaceChildren();
  visible.forEach(p => {
    const card = el('article','product'), button = el('button','product-open');button.setAttribute('aria-label',`Preview ${p.name}`);
    const art = el('div','art-wrap'), img = el('img');img.src=validImage(p.image)?p.image:'assets/favicon.svg';img.alt=p.name+' template artwork';img.loading='lazy';img.width=900;img.height=650;
    art.append(img, el('span','art-arrow','↗'));if(p.sample) art.append(el('span','sample','SAMPLE CONCEPT'));
    const info=el('div','product-info'), title=el('div');title.append(el('h3','',p.name),el('p','',`${p.category} / ${p.format}`));info.append(title,el('span','price',p.sample?'COMING SOON':(p.price || 'VIEW ON ETSY')));button.append(art,info);button.addEventListener('click',()=>openProduct(p));card.append(button);grid.append(card);
  });
  document.querySelector('#empty').hidden = visible.length > 0;
  document.querySelector('#results-status').textContent=`${visible.length} templates shown`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
document.querySelectorAll('.search-toggle').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#search-panel').hidden=false;document.querySelector('#shop').scrollIntoView();search.focus({preventScroll:true});}));
search.addEventListener('input',render);document.querySelector('#clear-search').addEventListener('click',()=>{search.value='';render();search.focus();});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
try { const response=await fetch('catalog.json');if(!response.ok)throw new Error('Catalog unavailable');products=await response.json();if(!Array.isArray(products))throw new Error('Invalid catalog');document.querySelector('[data-filter=all] sup').textContent=String(products.length).padStart(2,'0');document.querySelector('.catalog-note').hidden=!products.some(p=>p.sample);render(); } catch {grid.textContent='The catalog could not load. Please refresh and try again.';}
