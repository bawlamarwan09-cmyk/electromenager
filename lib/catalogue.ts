import {liveArray,liveRecord} from './storefront-server';
import type {Product} from './catalogue-utils';
export {money} from './catalogue-utils';
export type {Product} from './catalogue-utils';
export const brands=liveRecord(data=>data.brands);
export const products=liveArray<Product>(data=>data.products as unknown as Product[]);
export const categories=liveArray<string>(data=>data.families.map(f=>f.name));
