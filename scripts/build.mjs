import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });

const hubSource = 'products/ged-prep';
const hubOutput = 'dist/ged-prep';
await mkdir(hubOutput, { recursive: true });
for (const file of ['index.html', 'app.js', 'styles.css', 'schmutz.css', 'ged-prep-cover.png']) {
  await cp(`${hubSource}/${file}`, `${hubOutput}/${file}`);
}
await cp(`${hubSource}/data`, `${hubOutput}/data`, { recursive: true });

console.log('Built Schmutz and GED Prep Hub in dist/');
