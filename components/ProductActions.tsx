'use client';
import {useState} from 'react';
import Link from 'next/link';
import {Minus, Plus, ShoppingBag} from 'lucide-react';
import {useQuote} from './Shell';

export default function ProductActions({slug, unavailable=false}:{slug:string;unavailable?:boolean}) {
  const [quantity,setQuantity]=useState(1);
  const quote=useQuote();
  const request=`/demande-de-devis/?produit=${encodeURIComponent(slug)}&quantite=${quantity}`;
  return <div className="pdp-actions">
    <label className="pdp-quantity-label" htmlFor="product-quantity">Quantité souhaitée</label>
    <div className="pdp-order-row">
      <div className="pdp-quantity">
        <button type="button" aria-label="Diminuer la quantité" disabled={quantity<=1} onClick={()=>setQuantity(q=>Math.max(1,q-1))}><Minus size={16}/></button>
        <input id="product-quantity" type="number" min="1" max="999" inputMode="numeric" value={quantity} onChange={e=>setQuantity(Math.max(1,Math.min(999,Number.parseInt(e.target.value)||1)))}/>
        <button type="button" aria-label="Augmenter la quantité" disabled={quantity>=999} onClick={()=>setQuantity(q=>Math.min(999,q+1))}><Plus size={16}/></button>
      </div>
      <button className="pdp-primary" disabled={unavailable} onClick={()=>quote.add(slug,quantity)}><ShoppingBag size={19}/>{unavailable?'Indisponible actuellement':'Ajouter à ma sélection'}</button>
    </div>
    <Link className="pdp-secondary" href={request}>{unavailable?'Me renseigner sur ce modèle':'Demander mon prix et ma disponibilité'}</Link>
    <p className="pdp-action-note">Préparez votre demande avec la quantité de votre choix.</p>
  </div>;
}
