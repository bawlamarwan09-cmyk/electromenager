import Link from 'next/link';
import {families} from '@/lib/families';
import {brands,money,products,type Product} from '@/lib/catalogue';
import ProductPhoto from './ProductPhoto';

function Shelf({title,items,href}:{title:string;items:Product[];href?:string}) {
  if (!items.length) return null;
  return <section className="merch-section">
    <div className="merch-heading"><h2>{title}</h2>{href && <Link href={href}>Tout voir ›</Link>}</div>
    <div className="merch-track" tabIndex={0} aria-label={title}>{items.map(p=>
      <Link className="merch-item" key={p.slug} href={`/produits/${p.slug}/`}>
        <div className="merch-photo"><ProductPhoto image={p.image} alt={p.name}/>{p.discount>0 && <b>−{p.discount} %</b>}</div>
        <small>{brands[p.brand]}</small><h3>{p.name}</h3>
        <p>{Object.values(p.specs).slice(0,2).join(' · ')}</p>
        <strong>{money(p.price)}</strong> {p.discount>0 && <del>{money(p.originalPrice)}</del>}
      </Link>)}</div>
  </section>;
}
export default function HomeCatalogue() {
  const groups=families.map(f=>({...f,items:products.filter(p=>p.family===f.slug)}));
  return <div className="container home-merch">
    <section><div className="merch-heading"><h2>Découvrir nos catégories</h2><Link href="/produits/">Catalogue ›</Link></div>
      <div className="merch-track merch-categories" tabIndex={0} aria-label="Catégories">{groups.map(f=>
        <Link key={f.slug} href={`/${f.slug}/`}><ProductPhoto image={f.items[0]?.image} alt={f.name}/><strong>{f.name}</strong></Link>)}</div></section>
    <Shelf title="Offres du moment" items={products.filter(p=>p.discount>0 && p.price!==null)}/>
    {groups.map(f=><Shelf key={f.slug} title={f.name} items={f.items} href={`/${f.slug}/`}/>)}
  </div>;
}
