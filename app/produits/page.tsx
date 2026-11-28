import {staticMeta} from '@/lib/seo';
import {universes} from '@/lib/families';
import {Suspense} from 'react';
import Catalogue from '@/components/Catalogue';
import Link from 'next/link';
export const metadata=staticMeta('/produits/');
export default function Page(){return <div className="container page-section"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span>Nos produits</div><span className="eyebrow">VOTRE QUOTIDIEN, BIEN ÉQUIPÉ</span><h1>Le bon équipement,<br/>pour chaque besoin.</h1><p className="page-lead">Froid, lavage, cuisson et entretien. Découvrez notre sélection de produits.</p><nav className="related" aria-label="Univers du catalogue">{Object.entries(universes).map(([slug,name])=><Link key={slug} href={`/produits/univers/${slug}/`}>{name}</Link>)}</nav><Suspense fallback={<p>Chargement du catalogue…</p>}><Catalogue/></Suspense></div>}
