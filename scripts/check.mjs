import { productLinks } from '../public/marketplaces.js';
import {readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const catalog=JSON.parse(await readFile('public/catalog.json','utf8'));
if(!Array.isArray(catalog))throw Error('Catalog must be an array');
if(new Set(catalog.map(p=>p.id)).size!==catalog.length)throw Error('Duplicate product IDs');
for(const p of catalog){if(!p.name||!p.category||!p.format||!p.description)throw Error(`Missing fields: ${p.id}`);if(!p.sample&&(!productLinks(p).length||!productLinks(p,'commercial').length))throw Error('Product needs an Etsy or Gumroad listing for each license');if(p.image.startsWith('assets/'))await access('public/'+p.image);}
for(const f of ['app.js','studio.js','marketplaces.js'])execFileSync(process.execPath,['--check','public/'+f],{stdio:'inherit'});
for(const f of ['index.html','studio.html','styles.css','assets/favicon.svg'])await access('public/'+f);
console.log(`Checked ${catalog.length} products, artwork files, and JavaScript syntax.`);
