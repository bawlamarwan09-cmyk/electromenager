import {Package} from 'lucide-react';
const keys = new Set(['fridge','washer','oven','vacuum','lave-vaisselle','chauffe-eau','plaques-de-cuisson','congelateurs','hottes']);
const cutouts = new Set(['fridge','washer','oven','vacuum','chauffe-eau']);
export default function ProductPhoto({image,alt='',priority=false}:{image?:string;alt?:string;priority?:boolean}) {
  const src = image && (cutouts.has(image) ? `/images/kitchen/${image}.webp` : keys.has(image) ? `/images/catalogue/${image}.webp` :
    /^(https:\/\/|\/images\/)/.test(image) ? image : null);
  return src ? <img src={src} alt={alt} loading={priority?'eager':'lazy'}/> : <Package aria-hidden="true" size={42}/>;
}
