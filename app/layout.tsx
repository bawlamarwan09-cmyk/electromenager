import Analytics from '@/components/Analytics';
import {siteUrl,indexable} from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import {connection} from 'next/server';
import {getStorefront} from '@/lib/storefront-server';
import {CatalogueProvider} from '@/components/CatalogueProvider';
import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, QuoteProvider } from '@/components/Shell';
export const metadata: Metadata = { title: {default:'Aura Volt — Électroménager pour votre maison et vos projets',template:'%s | Aura Volt'},description:'Découvrez le prototype Aura Volt : électroménager, vente en gros et solutions pour revendeurs, promoteurs et hôteliers au Maroc.',metadataBase:new URL(siteUrl),robots:{index:indexable,follow:true},verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined}};
export default async function RootLayout({children}:{children:React.ReactNode}) {if(process.env.LIVE_CATALOGUE==='1')await connection();const data=process.env.LIVE_CATALOGUE==='1'?getStorefront():undefined;return <html lang="fr"><body>{indexable&&<Analytics id={process.env.NEXT_PUBLIC_GA_ID||''}/>}<JsonLd data={{'@context':'https://schema.org','@type':'Organization',name:'Aura Volt',url:siteUrl,foundingDate:'1970'}}/><CatalogueProvider initial={data} live={process.env.LIVE_CATALOGUE==='1'}><QuoteProvider><a className="skip" href="#contenu">Aller au contenu</a><Header/><main id="contenu">{children}</main><Footer/></QuoteProvider></CatalogueProvider></body></html>}
