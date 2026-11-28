import {pageMeta} from '@/lib/seo';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {brands, products} from '@/lib/catalogue';
import {families} from '@/lib/families';
import ProductCard from '@/components/ProductCard';

type Props = {params: Promise<{brand: string}>};
export function generateStaticParams() {
  return [...new Set(products.map(p=>p.brand))].map(brand => ({brand}));
}
async function current({params}: Props) {
  const {brand} = await params;
  return products.find(product => product.brand === brand)?.brand ?? notFound();
}
export async function generateMetadata(props: Props) {
  const key=await current(props);return pageMeta(`/marques/${key}/`,brands[key]+' · Électroménager au Maroc',`Explorez les équipements ${brands[key]} par catégorie. Consultez les références disponibles chez Aura Volt et préparez votre demande de prix.`,key!=='marque-a-confirmer');
}
export default async function Page(props: Props) {
  const key = await current(props);
  const items = products.filter(product => product.brand === key);
  return <section className="container page-section">
    <Link href="/produits/">Catalogue</Link><h1>{brands[key]}</h1>
    <p className="page-lead">Découvrez les produits de cette marque disponibles dans notre sélection.</p>
    {families.filter(f => items.some(p => p.category === f.name)).map(f =>
      <section key={f.slug}><h2>{f.name}</h2>
        <div className="products-grid">{items.filter(p => p.category === f.name).map(p => <ProductCard key={p.slug} product={p}/>)}</div>
        <Link href={`/marques/${key}/${f.slug}/`}>Voir {f.name} · {brands[key]}</Link>
      </section>)}
  </section>;
}
