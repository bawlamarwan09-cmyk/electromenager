export type Product = { availability:'in_stock'|'out_of_stock'|'unconfirmed'; isDemo:boolean; sources:{url:string;label:string}[]; images:{url:string;alt:string}[]; slug:string; name:string; category:string; family:string; brand:string;
  price:number|null; originalPrice:number|null; discount:number; image:string; description:string; specs:Record<string,string> };
export const money = (price:number|null) => price === null ? 'Prix sur demande' : new Intl.NumberFormat('fr-MA').format(price)+' DH';
