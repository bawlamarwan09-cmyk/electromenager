import {products,brands} from './catalogue';
import {families,universes} from './families';
import {articles} from './advice';
import {absolute,staticPages,canonicalProductPath,productEligible} from './seo';
export function sitemapEntries(){const paths:string[]=[...staticPages.map(p=>p[0]),...families.map(f=>`/${f.slug}/`),...Object.keys(universes).map(u=>`/produits/univers/${u}/`),...articles.map(a=>`/conseils/${a.slug}/`),...['revendeurs','promoteurs-immobiliers','hotels-riads'].map(s=>`/professionnels/${s}/`)];
for(const brand of [...new Set(products.map(p=>p.brand))])if(brand!=='marque-a-confirmer'){paths.push(`/marques/${brand}/`);for(const f of families)if(products.filter(p=>p.brand===brand&&p.family===f.slug).length>1)paths.push(`/marques/${brand}/${f.slug}/`)}
for(const p of products){const path=`/produits/${p.slug}/`;if(productEligible(p)&&canonicalProductPath(path)===path)paths.push(path)}
return [...new Set(paths)].map(path=>({url:absolute(path)}))}
