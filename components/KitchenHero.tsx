'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ChevronLeft, ChevronRight, Plus} from 'lucide-react';
import {money, products} from '@/lib/catalogue';
import ProductPhoto from './ProductPhoto';
import './kitchen.css';

const positions = [
  {family:'refrigerateurs', label:'Réfrigérateur', x:23,y:48},
  {family:'fours', label:'Four', x:43,y:49},
  {family:'machines-a-cafe', label:'Machine à café', x:63.3,y:47.6},
  {family:'appareils-a-panini', label:'Presse-panini', x:80,y:49.5},
  {family:'machines-a-laver', label:'Lave-linge', x:61,y:70},
  {family:'aspirateurs', label:'Aspirateur', x:95,y:61},
];
const groups = positions.map(point=>({...point,models:products.filter(p=>p.family===point.family)})).filter(g=>g.models.length);
const cutouts = new Set(['fridge','oven','washer','vacuum']);

export default function KitchenHero() {
  const [family,setFamily]=useState('machines-a-cafe');
  const [index,setIndex]=useState(0);
  const active=groups.find(g=>g.family===family) ?? groups[0];
  const model=active?.models[index] ?? active?.models[0];
  const image=model && cutouts.has(model.image) ? `/images/kitchen/${model.image}.webp` : model?.image;
  function step(delta:number) {
    setIndex(current=>(current+delta+active.models.length)%active.models.length);
  }
  return <section className="kitchen" aria-label="Cuisine interactive">
    <div className="kitchen-scene">
      <img className="kitchen-room" src="/images/kitchen/scene.webp" alt="Cuisine équipée en noyer et travertin" fetchPriority="high"/>
      <h1>La cuisine.<br/>À vous.</h1>
      {groups.map(g=><button key={g.family} type="button" className="kitchen-pin" style={{left:g.x+'%',top:g.y+'%'}}
        aria-label={g.label} aria-pressed={g===active} aria-controls="kitchen-selection" title={g.label}
        onClick={()=>{setFamily(g.family);setIndex(0)}}><span><Plus size={17}/></span></button>)}
    </div>
    <div className="kitchen-stage" id="kitchen-selection">
      {model ? <>
        <div key={model.slug} className="kitchen-object"><ProductPhoto image={image}/></div>
        <div className="kitchen-card">
          <div aria-live="polite" aria-atomic="true"><small>{active.label}</small><h2>{model.name}</h2><strong>{money(model.price)}</strong></div>
          <div className="kitchen-actions">
            {active.models.length>1 && <><button aria-label="Modèle précédent" onClick={()=>step(-1)}><ChevronLeft/></button>
              <span>{index+1} / {active.models.length}</span><button aria-label="Modèle suivant" onClick={()=>step(1)}><ChevronRight/></button></>}
            <Link href={`/produits/${model.slug}/`}>Voir la fiche</Link>
          </div>
        </div></> : <Link href="/produits/">Découvrir le catalogue</Link>}
    </div>
  </section>;
}
