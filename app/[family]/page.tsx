import {pageMeta} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import {breadcrumbs} from '@/lib/structured-data';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {families} from '@/lib/families';
import {products} from '@/lib/catalogue';
import BrandFilter from '@/components/BrandFilter';
import {universes} from '@/lib/families';
type Props={params:Promise<{family:string}>};
export function generateStaticParams(){return families.map(f=>({family:f.slug}))}
async function current({params}:Props){const {family}=await params;return families.find(f=>f.slug===family)??notFound()}
export async function generateMetadata(props:Props){const f=await current(props);return pageMeta(`/${f.slug}/`,f.name+' au Maroc',f.advice||`Découvrez notre sélection ${f.name.toLowerCase()} : marques, caractéristiques disponibles et demandes de prix pour particuliers et professionnels.`)}
export default async function Page(props:Props){const f=await current(props);return <section className="container page-section"><Link href="/produits/">Catalogue</Link><span> / </span><Link href={`/produits/univers/${f.univers}/`}>{universes[f.univers as keyof typeof universes]}</Link><JsonLd data={breadcrumbs([{name:'Accueil',path:'/'},{name:'Produits',path:'/produits/'},{name:f.name,path:`/${f.slug}/`}])}/><h1>{f.name}</h1><p className="page-lead">{f.advice}</p><BrandFilter key={f.slug} items={products.filter(p=>p.category===f.name)}/><nav className="related">{f.guide&&<Link href={`/conseils/${f.guide}/`}>Consulter le guide de choix</Link>}<Link href="/demande-de-devis/">Demander un prix en quantité</Link><Link href="/livraison-installation/">Préparer la livraison</Link></nav></section>}
