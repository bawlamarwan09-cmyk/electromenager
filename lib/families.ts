import {liveArray,liveRecord} from './storefront-server';
export const families=liveArray(data=>data.families);
export const universes=liveRecord(data=>data.universes);
