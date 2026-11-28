import Link from 'next/link';
import {notFound} from 'next/navigation';
import {products,brands} from '@/lib/catalogue';
import {families} from '@/lib/families';
import {pageMeta} from '@/lib/seo';
import {breadcrumbs} from '@/lib/structured-data';
import JsonLd from '@/components/JsonLd';
import ProductCard from '@/components/ProductCard';
type Props={params:Promise<{brand:string;family:string}>};
export function generateStaticParams(){return [...new Set(products.map(p=>p.brand+'|'+p.family))].map(key=>{const [brand,family]=key.split('|');return {brand,family}})}
async function current({params}:Props){const {brand,family}=await params;const f=families.find(f=>f.slug===family);const items=products.filter(p=>p.brand===brand&&p.family===family);if(!f||!items.length)notFound();return {brand,f,items}}
export async function generateMetadata(props:Props){const {brand,f,items}=await current(props);return pageMeta(`/marques/${brand}/${f.slug}/`,`${f.name} ${brands[brand]} au Maroc`,`Comparez notre sélection ${f.name.toLowerCase()} ${brands[brand]} : références, caractéristiques disponibles et demande de devis Aura Volt.`,brand!=='marque-a-confirmer'&&items.length>1)}
export default async function Page(props:Props){const {brand,f,items}=await current(props);const path=`/marques/${brand}/${f.slug}/`;return <section className="container page-section"><JsonLd data={breadcrumbs([{name:'Accueil',path:'/'},{name:brands[brand],path:`/marques/${brand}/`},{name:f.name,path}])}/><nav className="breadcrumbs"><Link href="/produits/">Catalogue</Link><span>/</span><Link href={`/marques/${brand}/`}>{brands[brand]}</Link><span>/</span>{f.name}</nav><h1>{f.name} {brands[brand]}</h1><p className="page-lead">Retrouvez les références {brands[brand]} de cette catégorie. Comparez les caractéristiques renseignées et précisez le modèle, la quantité et votre ville lors de votre demande.</p>{f.advice&&<p>{f.advice}</p>}<div className="products-grid">{items.map(p=><ProductCard key={p.slug} product={p}/>)}</div><nav className="related"><Link href={`/${f.slug}/`}>Comparer toutes les marques de {f.name.toLowerCase()}</Link>{f.guide&&<Link href={`/conseils/${f.guide}/`}>Guide de choix</Link>}<Link href="/demande-de-devis/">Demander un devis</Link></nav></section>}
