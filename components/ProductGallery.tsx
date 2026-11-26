'use client';
import {useState} from 'react';
import ProductPhoto from './ProductPhoto';
export default function ProductGallery({image,images,name}:{image:string;images:{url:string;alt:string}[];name:string}) {
  const [selected,setSelected]=useState(image);
  return <div className="product-gallery-public">
    <div className="detail-art"><ProductPhoto image={selected}/></div>
    {images.length>1 && <div className="product-thumbnails" aria-label="Photos du produit">
      {images.map((photo,index)=><button key={photo.url} onClick={()=>setSelected(photo.url)} aria-label={`Photo ${index+1} de ${name}`} aria-pressed={selected===photo.url}><img src={photo.url} alt={photo.alt}/></button>)}
    </div>}
  </div>;
}
