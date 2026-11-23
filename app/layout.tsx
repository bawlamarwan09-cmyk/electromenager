import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer, QuoteProvider } from '@/components/Shell';
export const metadata: Metadata = { title: {default:'Aura Volt — Électroménager pour votre maison et vos projets',template:'%s | Aura Volt'},description:'Découvrez le prototype Aura Volt : électroménager, vente en gros et solutions pour revendeurs, promoteurs et hôteliers au Maroc.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="fr"><body><QuoteProvider><a className="skip" href="#contenu">Aller au contenu</a><Header/><main id="contenu">{children}</main><Footer/></QuoteProvider></body></html>}
