"use client";
import {createContext,useContext,useEffect,useState,useRef} from 'react';
import {useRouter} from 'next/navigation';
import type {Storefront} from '@/lib/storefront-server';
import type {Product} from '@/lib/catalogue-utils';
const Context=createContext<Storefront|null>(null);
export function CatalogueProvider({initial,live,children}:{initial:Storefront;live:boolean;children:React.ReactNode}){
 const [data,setData]=useState(initial);const router=useRouter();const revision=useRef(JSON.stringify(initial));
 useEffect(()=>{setData(initial);revision.current=JSON.stringify(initial)},[initial]);
 useEffect(()=>{if(!live)return;let active=true;const update=async()=>{try{const r=await fetch('/catalogue-live.json',{cache:'no-store'});if(r.ok){const next=await r.json();if(active&&Array.isArray(next.products)&&Array.isArray(next.families)){const version=JSON.stringify(next);if(version!==revision.current){revision.current=version;setData(next);router.refresh()}}}}catch{}};const timer=setInterval(update,3000);window.addEventListener('focus',update);return()=>{active=false;clearInterval(timer);window.removeEventListener('focus',update)}},[live,router]);
 return <Context.Provider value={data}>{children}</Context.Provider>;
}
export function useCatalogue(){const data=useContext(Context);if(!data)throw new Error('CatalogueProvider absent');return {...data,products:data.products as unknown as Product[],categories:data.families.map(f=>f.name)};}
