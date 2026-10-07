import {readFile,stat} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {services,menus} from './content.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=join(root,'dist');
const routes=['/',...menus.map(m=>m.path),...services.map(s=>`/services/${s.slug}/`)];
const titles=new Set(), descriptions=new Set(), canonical=new Set(), primaryImages=new Set();
let imageCount=0,linkCount=0;
for(const route of routes){
 const html=await readFile(join(out,route,'index.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
 const desc=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 const canon=html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
 assert(title&&desc&&canon,`Missing SEO metadata: ${route}`);
 assert(!titles.has(title)&&!descriptions.has(desc)&&!canonical.has(canon),`Duplicate metadata: ${route}`);
 titles.add(title);descriptions.add(desc);canonical.add(canon);
 const primary=html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
 assert(primary&&!primaryImages.has(primary),`Missing or duplicate page representative image: ${route}`);
 primaryImages.add(primary);
 assert.equal([...html.matchAll(/<h1[ >]/g)].length,1,`Expected one H1: ${route}`);
 assert(html.includes('<html lang="ko">'));
 const blocks=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const lists=blocks.filter(x=>x['@type']==='ItemList');
 const webPage=blocks.flatMap(x=>x['@graph']||[]).find(x=>x['@type']==='WebPage');
 assert.equal(webPage.primaryImageOfPage.url,primary,`OG and WebPage image differ: ${route}`);
 assert(html.includes(`src="${new URL(primary).pathname}"`),`Representative image not visible: ${route}`);
 assert.equal(lists.length,route==='/'?1:0,`ItemList placement: ${route}`);
 if(route==='/'){
  const list=lists[0];assert.equal(list.itemListElement.length,6);assert.equal(list.numberOfItems,6);
  assert.equal(new Set(list.itemListElement.map(x=>x.image)).size,6);
  const track=html.match(/<div class="carousel-track"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert(track,'Missing visible carousel');
  list.itemListElement.forEach((item,i)=>{
   assert.equal(item['@type'],'ListItem');assert.equal(item.position,i+1);assert.equal(item.name,services[i].name);
   assert.equal(new URL(item.url).pathname,`/services/${services[i].slug}/`);
   assert.equal(new URL(item.image).pathname,`/assets/images/${services[i].image}.jpg`);
   assert(track.includes(`>${item.name}</a>`)&&track.includes(`/services/${services[i].slug}/`)&&track.includes(`/assets/images/${services[i].image}.jpg`));
   assert.equal(new URL(item.url).origin,new URL(canon).origin);assert.equal(new URL(item.image).origin,new URL(canon).origin);
  });
 }
 const imgs=[...html.matchAll(/<img [^>]*src="([^"]+)"[^>]*>/g)];assert(imgs.length>0,`No image: ${route}`);
 for(const m of imgs){assert(/alt="[^"]+"/.test(m[0]));assert((await stat(join(out,m[1]))).isFile());imageCount++;}
 for(const m of html.matchAll(/(?:href|srcset)="([^" ]+)"/g)){
  const target=m[1];if(!target.startsWith('/')||target.startsWith('//'))continue;
  const [path,anchor]=target.split('#');const dest=path||route;
  await stat(join(out,dest.endsWith('/')?dest+'index.html':dest));linkCount++;
  if(anchor){const targetHtml=await readFile(join(out,dest.endsWith('/')?dest+'index.html':dest),'utf8');assert(targetHtml.includes(`id="${anchor}"`));}
 }
 assert(html.includes('tel:01081421319'));
}
const sitemap=await readFile(join(out,'sitemap.xml'),'utf8');
const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(sitemapUrls.length,routes.length);assert.deepEqual(new Set(sitemapUrls),canonical);
const rss=await readFile(join(out,'rss.xml'),'utf8');assert.equal([...rss.matchAll(/<item>/g)].length,11);
assert((await readFile(join(out,'robots.txt'),'utf8')).includes('Sitemap: '+sitemapUrls[0]+'sitemap.xml'));
assert((await readFile(join(out,'404.html'),'utf8')).includes('noindex,follow'));
assert(!(await readFile(join(out,'_redirects'),'utf8')).includes('/* /index.html'));
console.log(`PASS: ${routes.length} pages, ${imageCount} image references, ${linkCount} internal links, one matching six-item carousel, unique SEO metadata and 12 distinct page representative images, sitemap/RSS and 404.`);
