'use client';
import {useCatalogue} from './CatalogueProvider';
import {money,type Product} from '@/lib/catalogue-utils';
import {useState} from 'react';
import ProductCard from './ProductCard';

export default function BrandFilter({items}: {items: Product[]}) {const {products,brands,families,categories}=useCatalogue();
  const [brand, setBrand] = useState('');
  const available = [...new Set(items.map(product => product.brand))];
  const visible = items.filter(product => !brand || product.brand === brand);
  return <>
    <label className="sort-label">Filtrer par marque
      <select value={brand} onChange={event => setBrand(event.target.value)}>
        <option value="">Toutes les marques</option>
        {available.map(key => <option key={key} value={key}>{brands[key]}</option>)}
      </select>
    </label>
    <p className="result-count" aria-live="polite">{visible.length} modèle{visible.length > 1 ? 's' : ''}</p>
    <div className="products-grid">{visible.map(product => <ProductCard key={product.slug} product={product}/>)}</div>
  </>;
}
