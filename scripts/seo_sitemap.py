"""Generate the live public sitemap from the same snapshot used by the storefront."""
from pathlib import Path
import json,os
from urllib.parse import urlsplit
from xml.etree.ElementTree import Element, SubElement, tostring
ROOT=Path(__file__).resolve().parents[1]
PREVIEW='https://aura-volt-electromenager-demo.bawlamarwan09.chatgpt.site'
def render(data):
    origin=urlsplit(os.environ.get('SITE_URL',PREVIEW));base=origin.scheme+'://'+origin.netloc
    review=json.loads((ROOT/'database/imports/seo-catalogue-review.json').read_text())
    incomplete={x['url'] for key in ('multi_model_pages','partial_reference_pages','unknown_model_pages') for x in review[key]}
    aliases=json.loads((ROOT/'lib/product-canonicals.json').read_text())
    paths=['/','/produits/','/conseils/','/contact/','/demande-de-devis/','/notre-entreprise/','/livraison-installation/','/livraison-sav/','/garantie-sav/','/professionnels/','/livraison-zones/']
    paths += ['/'+x['slug']+'/' for x in data['families']]
    paths += ['/produits/univers/'+x+'/' for x in data['universes']]
    paths += ['/conseils/'+x['slug']+'/' for x in data['articles']]
    paths += ['/professionnels/'+x+'/' for x in ('revendeurs','promoteurs-immobiliers','hotels-riads')]
    for brand in sorted({p['brand'] for p in data['products']} - {'marque-a-confirmer'}):
        paths.append('/marques/'+brand+'/')
        for family in data['families']:
            if sum(p['brand']==brand and p['family']==family['slug'] for p in data['products'])>1:paths.append('/marques/'+brand+'/'+family['slug']+'/')
    for p in data['products']:
        path='/produits/'+p['slug']+'/'
        if p['brand']!='marque-a-confirmer' and path not in incomplete and path not in aliases:paths.append(path)
    root=Element('urlset',xmlns='http://www.sitemaps.org/schemas/sitemap/0.9')
    for path in dict.fromkeys(paths):SubElement(SubElement(root,'url'),'loc').text=base+path
    return tostring(root,encoding='utf-8',xml_declaration=True)
