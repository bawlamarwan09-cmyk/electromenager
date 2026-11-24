import {Package} from 'lucide-react';
const keys = new Set(['fridge','washer','oven','vacuum','lave-vaisselle','chauffe-eau','plaques-de-cuisson','congelateurs','hottes']);
export default function ProductPhoto({image}:{image?:string}) {
  const src = image && (keys.has(image) ? `/images/catalogue/${image}.webp` :
    /^(https:\/\/|\/images\/)/.test(image) ? image : null);
  return src ? <img src={src} alt="" loading="lazy"/> : <Package aria-hidden="true" size={42}/>;
}
