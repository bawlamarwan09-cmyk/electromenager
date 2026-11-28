import {staticMeta} from '@/lib/seo';
import Link from 'next/link';
import { Store, Building2, BedDouble, PackageCheck, Check, ChevronRight } from 'lucide-react';
import Appliance from '@/components/Appliance';
import KitchenHero from '@/components/KitchenHero';
import HomeCatalogue from '@/components/HomeCatalogue';
export const metadata=staticMeta('/');
export default function Home(){return <>
<KitchenHero>
  <div className="hero-editorial-copy">
    <h1 id="home-title"><span>L’électroménager</span> <span>pour vos maisons</span> <span>et vos projets.</span></h1>
    <p>Un savoir-faire familial<br/>depuis 1970.</p>
    <Link href="/produits/">Explorer le catalogue</Link>
  </div>
</KitchenHero>
<div id="home-content" className="home-content">
<div className="intro-line container"><p>Un projet, un besoin, <strong>le bon équipement.</strong></p><span>Vente en gros & au détail</span></div>
<HomeCatalogue/>
<section className="professional-section"><div className="container pro-inner"><div className="pro-intro"><span className="eyebrow">AURA VOLT · PARTENAIRE DES PROFESSIONNELS</span><h2>Vos ambitions.<br/>Notre engagement.</h2><p>Un magasin à approvisionner ? Des logements à équiper ? Un établissement à préparer ? Construisons une offre autour de votre besoin.</p><Link className="button light" href="/professionnels/">Découvrir l’offre professionnelle</Link></div><div className="pro-list">{[[Store,'Revendeurs & magasins','Une sélection pour vos clients, des conditions pour votre activité.','revendeurs'],[Building2,'Promoteurs immobiliers','Des équipements cohérents pour l’ensemble de vos logements.','promoteurs-immobiliers'],[BedDouble,'Hôtels & riads','Des solutions adaptées à vos espaces et à vos usages.','hotels-riads']].map(([Icon,title,text,slug],i)=>{const I=Icon as typeof Store;return <Link href={`/professionnels/${slug}/`} key={i}><I size={30} strokeWidth={1.25}/><div><h3>{String(title)}</h3><p>{String(text)}</p></div><ChevronRight size={20}/></Link>})}</div></div></section>
<section className="story-section container"><div className="story-image"><img src="/images/showroom.png" alt="Showroom d’électroménager — illustration" loading="lazy"/><span>Le choix commence par l’écoute.</span></div><div className="story-copy"><span className="eyebrow">PLUS QU’UN ÉQUIPEMENT</span><h2>Un interlocuteur.<br/>À chaque étape.</h2><p>Choisir le bon appareil, organiser votre commande, comprendre les conditions de livraison : nous sommes là pour vous accompagner.</p><ul>{['Un conseil adapté à votre besoin','Une offre claire, selon votre projet','Un accompagnement après l’achat'].map(t=><li key={t}><Check size={18}/>{t}</li>)}</ul><Link href="/notre-entreprise/" className="under-link">Faire connaissance avec Aura Volt</Link></div></section>
<section className="section container advice-home"><div className="section-heading"><div><span className="eyebrow">FAIRE LE BON CHOIX</span><h2>Un peu de conseil. Beaucoup de confort.</h2></div><Link className="under-link" href="/conseils/">Tous nos conseils</Link></div><div className="advice-grid"><Link href="/conseils/choisir-capacite-lave-linge/" className="advice-card"><div className="advice-art"><Appliance type="washer"/></div><div><span className="category-label">GUIDE · LAVAGE</span><h3>Quelle capacité choisir pour votre lave-linge ?</h3><span className="under-link">Lire le conseil</span></div></Link><Link href="/conseils/choisir-refrigerateur/" className="advice-card"><div className="advice-art"><Appliance type="fridge"/></div><div><span className="category-label">GUIDE · FROID</span><h3>Le réfrigérateur adapté à votre quotidien.</h3><span className="under-link">Lire le conseil</span></div></Link></div></section>
<section className="contact-banner"><div className="container"><div><span className="eyebrow">ON EN PARLE ?</span><h2>Votre prochain projet commence ici.</h2></div><Link className="button" href="/contact/">Parlons de votre besoin</Link></div></section>
</div></>}
