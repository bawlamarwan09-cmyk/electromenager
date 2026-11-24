'use client';
import Link from 'next/link';
import {useState} from 'react';
import {Menu, X, ShoppingBag} from 'lucide-react';
import {useQuote} from './Shell';

export default function HeroNavigation() {
  const [open,setOpen]=useState(false);
  const quote=useQuote();
  return <div className="hero-nav">
    <Link href="/" className="hero-logo" aria-label="Aura Volt accueil"><img src="/images/logo-transparent.webp" alt="Aura Volt"/></Link>
    <nav aria-label="Navigation principale" className={open?'hero-links is-open':'hero-links'}>
      {[['/produits/','Catalogue'],['/professionnels/','Professionnels'],['/conseils/','Conseils'],['/notre-entreprise/','Notre entreprise']].map(([href,title])=>
        <Link key={href} href={href} onClick={()=>setOpen(false)}>{title}</Link>)}
    </nav>
    <div className="hero-nav-actions">
      <button className="hero-orders" aria-label={`Ma sélection, ${quote.items.length} produits`} onClick={quote.open}>
        <ShoppingBag size={20}/><span>Ma sélection</span>{quote.items.length>0 && <b>{quote.items.length}</b>}
      </button>
      <button className="hero-menu" aria-label={open?'Fermer le menu':'Ouvrir le menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    </div>
  </div>;
}
