'use client';
import {useRef,useState} from 'react';
import {Expand, X, Image as ImageIcon} from 'lucide-react';
import ProductPhoto from './ProductPhoto';

export default function ProductGallery({image,images,name}:{image:string;images:{url:string;alt:string}[];name:string}) {
  const photos=Array.from(new Map([{url:image,alt:name},...images].filter(p=>p.url).map(p=>[p.url,p])).values());
  const [selected,setSelected]=useState(image);
  const dialog=useRef<HTMLDialogElement>(null);
  const selectedPhoto=photos.find(p=>p.url===selected);
  return <div className="product-gallery-public">
    <div className="detail-art">
      {selected?<ProductPhoto image={selected} alt={selectedPhoto?.alt||name} priority/>:<div className="pdp-no-photo"><ImageIcon size={38} strokeWidth={1.2}/><strong>Visuel en préparation</strong><p>Renseignez-vous sur ce modèle auprès de notre équipe.</p></div>}
      {selected&&<button className="pdp-expand" onClick={()=>dialog.current?.showModal()} aria-label={`Agrandir la photo de ${name}`}><Expand size={17}/><span>Voir en grand</span></button>}
    </div>
    {photos.length>1&&<div className="product-thumbnails" aria-label="Photos du produit">
      {photos.map((photo,index)=><button key={photo.url} onClick={()=>setSelected(photo.url)} aria-label={`Afficher la photo ${index+1} de ${name}`} aria-pressed={selected===photo.url}><img src={photo.url} alt={photo.alt} loading="lazy"/></button>)}
    </div>}
    <dialog ref={dialog} className="pdp-image-dialog" aria-label={`Photo agrandie : ${name}`} onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close()}}>
      <div><form method="dialog"><button aria-label="Fermer la photo agrandie"><X size={24}/></button></form><ProductPhoto image={selected} alt={selectedPhoto?.alt||name}/><p>{name}</p></div>
    </dialog>
  </div>;
}
