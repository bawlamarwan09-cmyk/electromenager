import {pageMeta} from '@/lib/seo';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {families, universes} from '@/lib/families';

type Props = {params: Promise<{univers: string}>};
export function generateStaticParams() {
  return Object.keys(universes).map(univers => ({univers}));
}
async function current({params}: Props) {
  const {univers} = await params;
  return generateStaticParams().find(item => item.univers === univers)?.univers as keyof typeof universes || notFound();
}
export async function generateMetadata(props: Props) {
  const key=await current(props);return pageMeta(`/produits/univers/${key}/`,universes[key]+' au Maroc',`Découvrez les catégories de ${universes[key].toLowerCase()} Aura Volt, les références disponibles et les informations pour préparer votre achat.`);
}
export default async function Page(props: Props) {
  const key = await current(props);
  return <section className="container page-section">
    <Link href="/produits/">Catalogue</Link><h1>{universes[key]}</h1>
    <nav className="related" aria-label="Familles de produits">
      {families.filter(f => f.univers === key).map(f => <Link key={f.slug} href={`/${f.slug}/`}>{f.name}</Link>)}
    </nav>
  </section>;
}
