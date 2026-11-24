import data from './storefront.generated.json';
export const families: {slug:string; name:string; univers:string; advice:string; guide:string|null}[] = data.families;
export const universes: Record<string,string> = data.universes;
