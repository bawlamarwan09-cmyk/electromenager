import {Suspense} from 'react';
import Catalogue from '@/components/Catalogue';
import Link from 'next/link';
export const metadata={title:'Catalogue électroménager au Maroc'};
export default function Page(){return <div className="container page-section"><div className="breadcrumbs"><Link href="/">Accueil</Link><span>/</span>Nos produits</div><span className="eyebrow">VOTRE QUOTIDIEN, BIEN ÉQUIPÉ</span><h1>Le bon équipement,<br/>pour chaque besoin.</h1><p className="page-lead">Froid, lavage, cuisson et entretien. Découvrez notre collection de démonstration.</p><Suspense fallback={<p>Chargement du catalogue…</p>}><Catalogue/></Suspense></div>}
