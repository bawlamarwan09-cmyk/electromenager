'use client';
import Link from 'next/link';
import {useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Hand, X} from 'lucide-react';
import {money, products} from '@/lib/catalogue';
import ProductPhoto from './ProductPhoto';
import './kitchen.css';

const rooms = [
  {name:'Cuisine',photo:'scene',alt:'Cuisine en noyer équipée de gros et petit électroménager'},
  {name:'Chambre',photo:'bedroom',alt:'Chambre avec téléviseur'},
  {name:'Salle de bain',photo:'bathroom',alt:'Salle de bain avec douche et chauffe-eau'},
];
const kitchenPoints = [
  {family:'refrigerateurs', label:'Réfrigérateur', x:21,y:45},
  {family:'fours', label:'Four', x:36,y:39},
  {family:'machines-a-cafe', label:'Machine à café', x:50,y:40},
  {family:'appareils-a-panini', label:'Presse-panini', x:62,y:42},
  {family:'machines-a-laver', label:'Lave-linge', x:69,y:68},
  {family:'aspirateurs', label:'Aspirateur', x:94,y:55},
];
const positions = [
  ...kitchenPoints.map(point=>({...point,room:'scene'})),
  {room:'scene',family:'bouilloires',label:'Bouilloire',x:73,y:43},
  {room:'scene',family:'blenders',label:'Blender',x:81,y:40},
  {room:'bedroom',family:'televiseurs',label:'Téléviseur',x:86,y:37},
  {room:'bathroom',family:'chauffe-eau',label:'Chauffe-eau',x:66.5,y:23},
];
const groups = positions.map(point=>({...point,models:products.filter(p=>p.family===point.family)})).filter(g=>g.models.length);

export default function KitchenHero() {
  const [room,setRoom]=useState(rooms[0]);
  const [family,setFamily]=useState<string | null>(null);
  const [index,setIndex]=useState(0);
  const active=groups.find(g=>g.family===family);
  const model=active?.models[index] ?? active?.models[0];
  const trigger=useRef<HTMLButtonElement | null>(null);
  function close() {
    setFamily(null);
    requestAnimationFrame(()=>trigger.current?.focus({preventScroll:true}));
  }
  function step(delta:number) {
    if (active) setIndex(current=>(current+delta+active.models.length)%active.models.length);
  }
  return <section className="kitchen" aria-label="Explorer les pièces"
    onKeyDown={event=>{if(event.key==='Escape' && active) close()}}>
    <div className="kitchen-main">
    <div className="kitchen-scene" inert={!!active}>
      <img className="kitchen-room" src={`/images/kitchen/${room.photo}.webp`} alt={room.alt} fetchPriority="high"/>
      {groups.filter(g=>g.room===room.photo).map(g=><button key={g.family} type="button" className={'kitchen-pin pin-'+g.family} style={{left:g.x+'%',top:g.y+'%'}}
        aria-label={g.label} title={g.label}
        onClick={event=>{trigger.current=event.currentTarget;setFamily(g.family);setIndex(0)}}><span><Hand size={17} aria-hidden="true"/></span></button>)}
    </div>
    {!active && <span className="room-hint"><Hand size={16}/> Touchez un appareil</span>}
    {active && model && <div className="kitchen-stage" onClick={event=>{if(event.target===event.currentTarget) close()}}>
      <button type="button" autoFocus className="kitchen-close" aria-label="Revenir à la pièce" onClick={close}><X/></button>
      <div key={model.slug} className="kitchen-object"><ProductPhoto image={model.image}/></div>
      <div className="kitchen-card">
        <div aria-live="polite" aria-atomic="true"><small>{active.label}</small><h2>{model.name}</h2><strong>{money(model.price)}</strong></div>
        <div className="kitchen-actions">
          {active.models.length>1 && <><button aria-label="Modèle précédent" onClick={()=>step(-1)}><ChevronLeft/></button>
            <span>{index+1} / {active.models.length}</span><button aria-label="Modèle suivant" onClick={()=>step(1)}><ChevronRight/></button></>}
          <Link href={`/produits/${model.slug}/`}>Voir la fiche</Link>
        </div>
      </div>
    </div>}
    </div>
    <nav className="room-rail" aria-label="Choisir une pièce">
      {rooms.filter(r=>r!==room).map(r=><button key={r.photo} onClick={()=>{setRoom(r);setFamily(null);setIndex(0)}}>
        <img src={`/images/kitchen/${r.photo}.webp`} alt=""/><span>{r.name} <ChevronRight size={16}/></span>
      </button>)}
    </nav>
  </section>;
}
