'use client';
import Link from 'next/link';
import {useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Plus, X} from 'lucide-react';
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
  const [family,setFamily]=useState<string | null>(null);
  const [index,setIndex]=useState(0);
  const active=groups.find(g=>g.family===family);
  const model=active?.models[index] ?? active?.models[0];
  const image=model && cutouts.has(model.image) ? `/images/kitchen/${model.image}.webp` : model?.image;
  const trigger=useRef<HTMLButtonElement | null>(null);
  function close() {
    setFamily(null);
    requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}));
  }
  function step(delta:number) {
    if (active) setIndex(current=>(current+delta+active.models.length)%active.models.length);
  }
  return <section className="kitchen" aria-label="Cuisine interactive"
    onKeyDown={event=>{if(event.key==='Escape' && active) close()}}>
    <div className="kitchen-scene" inert={!!active}>
      <img className="kitchen-room" src="/images/kitchen/scene.webp" alt="Cuisine équipée en noyer et travertin" fetchPriority="high"/>
      {groups.map(g=><button key={g.family} type="button" className={'kitchen-pin pin-'+g.family} style={{left:g.x+'%',top:g.y+'%'}}
        aria-label={g.label} title={g.label}
        onClick={event=>{trigger.current=event.currentTarget;setFamily(g.family);setIndex(0)}}><span><Plus size={17}/></span></button>)}
    </div>
    {active && model && <div className="kitchen-stage" onClick={event=>{if(event.target===event.currentTarget) close()}}>
      <button type="button" autoFocus className="kitchen-close" aria-label="Revenir à la cuisine" onClick={close}><X/></button>
      <div key={model.slug} className="kitchen-object"><ProductPhoto image={image}/></div>
      <div className="kitchen-card">
        <div aria-live="polite" aria-atomic="true"><small>{active.label}</small><h2>{model.name}</h2><strong>{money(model.price)}</strong></div>
        <div className="kitchen-actions">
          {active.models.length>1 && <><button aria-label="Modèle précédent" onClick={()=>step(-1)}><ChevronLeft/></button>
            <span>{index+1} / {active.models.length}</span><button aria-label="Modèle suivant" onClick={()=>step(1)}><ChevronRight/></button></>}
          <Link href={`/produits/${model.slug}/`}>Voir la fiche</Link>
        </div>
      </div>
    </div>}
  </section>;
}
