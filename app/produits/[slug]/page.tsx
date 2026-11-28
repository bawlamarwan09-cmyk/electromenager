import {productMeta} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import {productSchema,breadcrumbs} from '@/lib/structured-data';
import {families} from '@/lib/families';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import {Check, Headphones, ShieldCheck, Truck, Building2, PackageCheck} from 'lucide-react';
import {products,money,brands, type Product} from '@/lib/catalogue';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import ProductCard from '@/components/ProductCard';
import './product.css';

export function generateStaticParams(){return products.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const product=products.find(p=>p.slug===slug);
  return product?productMeta(product):{};
}
function reference(p:Product) {
  return p.specs['Référence constructeur']||p.specs['Référence visible']||p.specs['Références visibles'];
}
const statuses={in_stock:'En stock',out_of_stock:'Indisponible actuellement',unconfirmed:'Disponibilité à confirmer'};

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const p=products.find(p=>p.slug===slug);
  if(!p)notFound();
  const family=families.find(f=>f.slug===p.family);
  const brand=brands[p.brand];
  const brandKnown=p.brand!=='marque-a-confirmer';
  const specs=Object.entries(p.specs);
  const highlights=specs.filter(([key])=>!key.toLowerCase().includes('référence')&&!key.toLowerCase().includes('code fabricant')).slice(0,4);
  const alternatives=products.filter(other=>other.slug!==p.slug&&other.family===p.family).sort((a,b)=>Number(b.brand===p.brand)-Number(a.brand===p.brand)).slice(0,4);
  const comparison=alternatives.slice(0,2);
  const comparisonKeys=[...new Set(specs.map(([key])=>key).filter(key=>comparison.some(other=>other.specs[key])))].slice(0,3);
  const request=`/demande-de-devis/?produit=${encodeURIComponent(p.slug)}`;
  const promotion=p.price!==null&&p.originalPrice!==null&&p.originalPrice>p.price;
  const availability=p.availability||'unconfirmed';
  return <article className="container page-section pdp">
    <JsonLd data={productSchema(p,brand)}/><JsonLd data={breadcrumbs([{name:'Accueil',path:'/'},{name:p.category,path:`/${p.family}/`},{name:p.name,path:`/produits/${p.slug}/`}])}/><nav className="breadcrumbs" aria-label="Fil d’Ariane">
      <Link href="/">Accueil</Link><span>/</span><Link href="/produits/">Produits</Link><span>/</span>
      <Link href={`/${p.family}/`}>{family?.name||p.category}</Link><span>/</span><span aria-current="page">{p.name}</span>
    </nav>

    <div className="pdp-top">
      <div className="pdp-gallery-column"><ProductGallery key={p.slug} image={p.image} images={p.images} name={p.name}/></div>
      <div className="pdp-summary">
        <div className="pdp-meta"><Link href={`/${p.family}/`}>{p.category}</Link>{brandKnown&&<><span>·</span><Link className="pdp-brand" href={`/marques/${p.brand}/`}>{brand}</Link></>}</div>
        <h1>{p.name}</h1>
        {reference(p)&&<p className="pdp-reference">Référence <strong>{reference(p)}</strong></p>}
        <p className="pdp-intro">{p.description}</p>
        {highlights.length>0&&<ul className="pdp-highlights" aria-label="L’essentiel de ce produit">{highlights.map(([label,value])=><li key={label}><Check size={17}/><span><span>{label}</span><strong>{value}</strong></span></li>)}</ul>}
        <div className="pdp-purchase">
          <div className="pdp-price-row"><div><span className="pdp-price-label">{p.price===null?'Une offre adaptée à votre besoin':'Prix du produit'}</span><strong className="pdp-price">{money(p.price)}</strong>{promotion&&<div className="pdp-promo"><del>{money(p.originalPrice)}</del><span>Économisez {money(p.originalPrice!-p.price!)}</span></div>}</div>{promotion&&<span className="pdp-discount">−{p.discount}%</span>}</div>
          <p className={`pdp-availability pdp-availability-${availability}`}><PackageCheck size={17}/>{statuses[availability]}</p>
          <ProductActions key={p.slug} slug={p.slug} unavailable={availability==='out_of_stock'}/>
          {p.isDemo&&<p className="pdp-demo">Modèle de démonstration · Prix fictif</p>}
        </div>
        <div className="pdp-reassurance">
          <Link href="/livraison-installation/"><Truck size={21}/><span><strong>Livraison au Maroc</strong><small>Délai et frais confirmés avant commande</small></span></Link>
          <Link href="/garantie-sav/"><ShieldCheck size={21}/><span><strong>Garantie & SAV</strong><small>Conditions précisées pour votre référence</small></span></Link>
          <Link href={request}><Headphones size={21}/><span><strong>Un conseil avant de choisir</strong><small>Maison ou projet professionnel</small></span></Link>
        </div>
        <Link className="pdp-business-link" href={`${request}&profil=revendeur`}><Building2 size={20}/><span>Vous achetez en quantité ? <strong>Demandez votre offre professionnelle.</strong></span></Link>
      </div>
    </div>

    <nav className="pdp-section-nav" aria-label="Dans cette fiche produit"><a href="#description">Description</a><a href="#caracteristiques">Caractéristiques</a><a href="#livraison">Livraison & garantie</a>{alternatives.length>0&&<a href="#alternatives">Comparer & découvrir</a>}</nav>
    <div className="pdp-content-grid">
      <section id="description" className="pdp-section pdp-description"><span className="pdp-kicker">FAITES CONNAISSANCE AVEC VOTRE ÉQUIPEMENT</span><h2>{p.name}</h2><p>{p.description}</p>
        {highlights.length>0&&<><h3>Les points à retenir</h3><dl className="pdp-feature-lines">{highlights.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></>}
        {family?.advice&&<div className="pdp-choice-advice"><strong>Pour bien choisir</strong><p>{family.advice}</p>{family.guide&&<Link href={`/conseils/${family.guide}/`}>Consulter notre guide de choix</Link>}</div>}
        <Link className="pdp-text-link" href={`/marques/${p.brand}/${p.family}/`}>Explorer {family?.name.toLowerCase()||p.category.toLowerCase()}</Link>
      </section>
      <section id="caracteristiques" className="pdp-section pdp-specifications"><span className="pdp-kicker">TOUTES LES INFORMATIONS, AU MÊME ENDROIT</span><h2>Fiche technique</h2><table><caption className="pdp-sr-only">Caractéristiques de {p.name}</caption><tbody><tr><th scope="row">Marque</th><td>{brandKnown?<Link href={`/marques/${p.brand}/`}>{brand}</Link>:'À confirmer'}</td></tr><tr><th scope="row">Catégorie</th><td><Link href={`/${p.family}/`}>{p.category}</Link></td></tr>{specs.map(([key,value])=><tr key={key}><th scope="row">{key}</th><td>{value}</td></tr>)}{!reference(p)&&<tr><th scope="row">Référence constructeur</th><td>À confirmer avec le magasin</td></tr>}<tr><th scope="row">Disponibilité</th><td>{statuses[availability]}</td></tr></tbody></table>
        {specs.length===0&&<p className="pdp-data-note">Besoin des dimensions, de la capacité ou de la puissance ? Demandez la fiche complète de cette référence.</p>}
        {p.sources.length>0&&<details className="pdp-sources"><summary>Consulter les sources de cette fiche</summary><ul>{p.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul></details>}
      </section>
    </div>

    <section id="livraison" className="pdp-section pdp-delivery"><div><span className="pdp-kicker">AVANT VOTRE COMMANDE</span><h2>Un achat bien préparé.</h2><p>Confirmez votre référence, votre ville et la quantité souhaitée pour recevoir une proposition adaptée.</p></div><div className="pdp-delivery-details"><div><Truck size={24}/><div><h3>Votre livraison</h3><p>Le délai, les frais et les conditions d’accès sont précisés selon la destination et la disponibilité.</p><Link href="/livraison-installation/">Les modalités de livraison</Link></div></div><div><ShieldCheck size={24}/><div><h3>Votre garantie</h3><p>La durée et la couverture sont à confirmer pour ce modèle et votre usage, particulier ou professionnel.</p><Link href="/garantie-sav/">Garantie et service après-vente</Link></div></div></div></section>

    {alternatives.length>0&&<section id="alternatives" className="pdp-section pdp-alternatives"><div className="pdp-section-heading"><div><span className="pdp-kicker">PRENEZ LE TEMPS DE COMPARER</span><h2>Le bon modèle pour vous.</h2></div><Link className="pdp-text-link" href={`/${p.family}/`}>Tous les modèles</Link></div>
      <div className="pdp-compare-scroll" role="region" aria-label="Comparaison des modèles" tabIndex={0}><table className="pdp-compare"><caption className="pdp-sr-only">Comparer {p.name} avec d’autres modèles de la même catégorie</caption><thead><tr><th scope="col">Votre choix</th>{[p,...comparison].map((item,i)=><th scope="col" key={item.slug}>{i===0&&<span className="pdp-current-label">Ce modèle</span>}<Link href={`/produits/${item.slug}/`}>{item.name}</Link></th>)}</tr></thead><tbody><tr><th scope="row">Marque</th>{[p,...comparison].map(item=><td key={item.slug}>{brands[item.brand]}</td>)}</tr>{comparisonKeys.map(key=><tr key={key}><th scope="row">{key}</th>{[p,...comparison].map(item=><td key={item.slug}>{item.specs[key]||'Non renseigné'}</td>)}</tr>)}<tr><th scope="row">Prix</th>{[p,...comparison].map(item=><td key={item.slug}><strong>{money(item.price)}</strong></td>)}</tr></tbody></table></div>
      <div className="products-grid">{alternatives.map(other=><ProductCard key={other.slug} product={other}/>)}</div>
    </section>}
    <aside className="pdp-help"><div><span>LE CONSEIL AURA VOLT</span><h2>Une question sur ce produit ?</h2><p>Un équipement pour votre maison ou plusieurs appareils pour votre activité : précisez votre besoin.</p></div><Link className="pdp-primary" href={request}>Parlons de votre projet</Link></aside>
  </article>;
}
