import {connection} from 'next/server';
import {getStorefront} from '@/lib/storefront-server';
import {CatalogueProvider} from '@/components/CatalogueProvider';
import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, QuoteProvider } from '@/components/Shell';
export const metadata: Metadata = { title: {default:'Aura Volt — Électroménager pour votre maison et vos projets',template:'%s | Aura Volt'},description:'Découvrez le prototype Aura Volt : électroménager, vente en gros et solutions pour revendeurs, promoteurs et hôteliers au Maroc.',robots:{index:false,follow:false}};
export default async function RootLayout({children}:{children:React.ReactNode}) {if(process.env.LIVE_CATALOGUE==='1')await connection();const data=getStorefront();return <html lang="fr"><body><CatalogueProvider initial={data} live={process.env.LIVE_CATALOGUE==='1'}><QuoteProvider><a className="skip" href="#contenu">Aller au contenu</a><Header/><main id="contenu">{children}</main><Footer/></QuoteProvider></CatalogueProvider></body></html>}
