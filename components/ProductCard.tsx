import Link from 'next/link';
import ProductPhoto from './ProductPhoto';
import { Product, money, brands } from '@/lib/catalogue';
export default function ProductCard({product:p}:{product:Product}){return <Link href={`/produits/${p.slug}/`} className="product-card"><div className="product-image"><span className="product-tag">{p.isDemo?'Collection démo':'Catalogue'}</span><ProductPhoto image={p.image}/><span className="product-discover">Découvrir</span></div><div className="product-info"><span className="category-label">{p.category} · {brands[p.brand]}</span><h3>{p.name}</h3><p>{Object.entries(p.specs).slice(0,2).map(([,v])=>v).join(' · ')}</p><strong>{money(p.price)}</strong><small>{p.isDemo?'Prix indicatif fictif':'Prix et disponibilité à confirmer'}</small></div></Link>}
