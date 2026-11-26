"""Import the supplied catalogue batch as editable drafts, preserving existing changes."""
import json
import re
import unicodedata
from manage import ROOT, database, query, script

def slug(value):
    ascii_text=unicodedata.normalize('NFKD',value).encode('ascii','ignore').decode().lower()
    return re.sub('[^a-z0-9]+','-',ascii_text).strip('-')

def import_batch(db, publish=False):
    data=json.loads((ROOT/'database/imports/photos-2026-11-26.json').read_text())
    for pid,name in [('gros','Gros électroménager'),('petit','Petit électroménager')]:
        query(db,'INSERT INTO catalogue_universe (id,slug,name) VALUES (?,?,?) ON CONFLICT DO NOTHING',(pid,pid,name))
    for category,title in data['categories'].items():
        universe='gros' if category in ('lave-vaisselle','machines-a-laver','refrigerateurs','plaques-de-cuisson','chauffe-eau','hottes','cuisinieres','climatiseurs','televiseurs') else 'petit'
        query(db,'INSERT INTO category (id,slug,name,universe_id) VALUES (?,?,?,?) ON CONFLICT DO NOTHING',(category,category,title,universe))
    for item in data['products']:
        brand=slug(item['brand'])
        query(db,'INSERT INTO brand (id,slug,name) VALUES (?,?,?) ON CONFLICT DO NOTHING',(brand,brand,item['brand']))
        category=query(db,'SELECT id FROM category WHERE slug=?',(item['category'],)).fetchone()
        if not category:raise ValueError('Catégorie absente : '+item['category'])
        brand_id=query(db,'SELECT id FROM brand WHERE slug=?',(brand,)).fetchone()[0]
        query(db,"""INSERT INTO product (id,brand_id,category_id,slug,sku,name,description,image_key,price_centimes,status)
            VALUES (?,?,?,?,?,?,?,?,NULL,'draft') ON CONFLICT DO NOTHING""",
            (item['id'],brand_id,category[0],item['slug'],item['id'],item['name'],item['description'],item['images'][0]))
        for pos,image in enumerate(item['images']):
            query(db,'INSERT INTO product_image (id,product_id,image_url,alt_text,display_order) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING',
                  (item['id']+'-'+str(pos),item['id'],image,item['name']+' — photo '+str(pos+1),pos))

    if publish:
        for item in data['products']:
            query(db,"UPDATE product SET status='published' WHERE id=? AND status='draft'",(item['id'],))

def run(publish=False):
    with database() as db:
        script(db,ROOT/'database/004_product_images.sql')
        import_batch(db,publish)
    print('Catalogue importé. '+('Les fiches du lot sont visibles sur le site.' if publish else 'Fiches en brouillon.'))

if __name__=='__main__':run()
