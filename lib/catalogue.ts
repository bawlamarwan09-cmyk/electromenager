import data from './storefront.generated.json';
import {families} from './families';
export type Product = { isDemo:boolean; images:{url:string;alt:string}[]; slug:string; name:string; category:string; family:string; brand:string;
  price:number|null; originalPrice:number|null; discount:number; image:string; description:string; specs:Record<string,string> };
export const brands: Record<string,string> = data.brands;
export const products = data.products as unknown as Product[];
export const categories = families.map(f => f.name);
export const money = (price:number|null) => price === null ? 'Prix sur demande' : new Intl.NumberFormat('fr-MA').format(price)+' DH';
