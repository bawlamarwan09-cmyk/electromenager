import {readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {cache} from 'react';
import initial from './storefront.generated.json';
export type Storefront = Omit<typeof initial,'brands'|'universes'> & {brands:Record<string,string>;universes:Record<string,string>};
let saved:{signature:string;data:Storefront}|undefined;
export const getStorefront = cache(():Storefront => {
  if(process.env.LIVE_CATALOGUE!=='1')return initial;
  const path=resolve(/* turbopackIgnore: true */ process.env.STOREFRONT_PATH||'lib/storefront.generated.json');
  const stat=statSync(/* turbopackIgnore: true */ path);const signature=`${stat.ino}:${stat.mtimeMs}:${stat.size}`;
  if(!saved||saved.signature!==signature)saved={signature,data:JSON.parse(readFileSync(/* turbopackIgnore: true */ path,'utf8'))};
  return saved.data;
});
export function liveArray<T>(select:(data:Storefront)=>T[]):T[]{
 return new Proxy([] as T[],{get(_target,key){const rows=select(getStorefront());const value=Reflect.get(rows,key);return typeof value==='function'?value.bind(rows):value;}});
}
export function liveRecord(select:(data:Storefront)=>Record<string,string>):Record<string,string>{
 return new Proxy({},{get(_target,key){return Reflect.get(select(getStorefront()),key)},ownKeys(){return Reflect.ownKeys(select(getStorefront()))},getOwnPropertyDescriptor(_target,key){const value=select(getStorefront())[String(key)];return value===undefined?undefined:{value,enumerable:true,configurable:true}}});
}
