import {staticMeta} from '@/lib/seo';
import Link from 'next/link';import {articles} from '@/lib/advice';import Appliance from '@/components/Appliance';
export const metadata=staticMeta('/conseils/');
export default function Page(){return <div className="container page-section"><span className="eyebrow">LES CONSEILS AURA VOLT</span><h1>Mieux choisir.<br/>Mieux vivre avec.</h1><p className="page-lead">Des repères simples pour préparer votre prochain équipement.</p><div className="advice-grid">{articles.map(a=><Link className="advice-card" href={`/conseils/${a.slug}/`} key={a.slug}><div className="advice-art"><Appliance type={a.image}/></div><div><span className="eyebrow">{a.category}</span><h2>{a.title}</h2><span className="under-link">Lire le conseil</span></div></Link>)}</div></div>}
