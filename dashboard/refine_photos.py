"""Apply reviewed facts and approved external photographs, preserving manual edits."""
import json
import hashlib
from manage import ROOT, database, query
from import_photos import slug

DETAILS = ROOT/'database/imports/verified-product-details.json'
REVIEW = ROOT/'database/imports/product-image-sourcing-review.json'
FIELDS = ('name', 'description', 'image_key', 'brand_id', 'category_id')

def refine_batch(db):
    # This small state table lets later research improve an automatically populated
    # field while retaining a value subsequently changed in the dashboard.
    query(db, '''CREATE TABLE IF NOT EXISTS product_import_state (
        product_id text PRIMARY KEY NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        applied_values text NOT NULL)''')
    verified=json.loads(DETAILS.read_text()) if DETAILS.exists() else {}
    reviews=json.loads(REVIEW.read_text()) if REVIEW.exists() else {'products':[]}
    images={p['product_id']:p.get('accepted_images',[]) for p in reviews['products']}
    original=json.loads((ROOT/'database/imports/photos-2026-11-26.json').read_text())
    for item in original['products']:
        pid=item['id']
        row=query(db,'SELECT '+','.join(FIELDS)+' FROM product WHERE id=?',(pid,)).fetchone()
        if not row:
            continue
        current=dict(zip(FIELDS,row))
        state=query(db,'SELECT applied_values FROM product_import_state WHERE product_id=?',(pid,)).fetchone()
        original_brand=query(db,'SELECT id FROM brand WHERE slug=?',(slug(item['brand']),)).fetchone()[0]
        original_category=query(db,'SELECT id FROM category WHERE slug=?',(item['category'],)).fetchone()[0]
        baseline=json.loads(state[0]) if state else dict(name=item['name'],description=item['description'],image_key=item['images'][0],brand_id=original_brand,category_id=original_category)
        facts=verified.get(pid,{})
        desired=dict(baseline)
        desired['name']=facts.get('name',baseline['name'])
        desired['description']=facts.get('description',baseline['description'])
        if facts.get('brand'):
            key=slug(facts['brand'])
            query(db,'INSERT INTO brand (id,slug,name) VALUES (?,?,?) ON CONFLICT DO NOTHING',(key,key,facts['brand']))
            desired['brand_id']=query(db,'SELECT id FROM brand WHERE slug=?',(key,)).fetchone()[0]
        if facts.get('category'):
            category=query(db,'SELECT id FROM category WHERE slug=?',(facts['category'],)).fetchone()
            if not category:
                query(db,'INSERT INTO category (id,slug,name,universe_id) VALUES (?,?,?,?) ON CONFLICT DO NOTHING',(facts['category'],facts['category'],facts['category_name'],'petit'))
                category=query(db,'SELECT id FROM category WHERE slug=?',(facts['category'],)).fetchone()
            desired['category_id']=category[0]
        approved=images.get(pid,[])
        if not approved and baseline['image_key'].startswith('/images/catalogue-sourced/'):
            desired['image_key']=item['images'][0]
        for pos,photo in enumerate(approved):
            url=photo['url']
            if photo.get('background')!='transparent' or not url.startswith('/images/catalogue-sourced/'):
                raise ValueError('Photographie non approuvée : '+pid)
            file=(ROOT/'public'/url.lstrip('/')).resolve()
            if not file.is_relative_to((ROOT/'public/images/catalogue-sourced').resolve()) or not file.is_file():
                raise ValueError('Fichier source absent : '+url)
            if hashlib.sha256(file.read_bytes()).hexdigest()!=photo['sha256']:
                raise ValueError('Photographie modifiée depuis sa validation : '+pid)
            query(db,'''INSERT INTO product_image (id,product_id,image_url,alt_text,display_order)
                VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING''',
                (pid+'-sourced-'+str(pos),pid,url,photo['alt'],pos))
        if approved:
            desired['image_key']=approved[0]['url']
        applied={key:desired[key] if current[key]==baseline[key] else current[key] for key in FIELDS}
        query(db,'UPDATE product SET '+','.join(key+'=?' for key in FIELDS)+' WHERE id=?',(*applied.values(),pid))
        # Store the last automatic values, not dashboard overrides.
        query(db,'''INSERT INTO product_import_state (product_id,applied_values) VALUES (?,?)
            ON CONFLICT (product_id) DO UPDATE SET applied_values=excluded.applied_values''',
            (pid,json.dumps(desired,ensure_ascii=False)))
        for order,(label,value) in enumerate(facts.get('specs',{}).items()):
            query(db,'INSERT INTO product_specification (product_id,label,value,display_order) VALUES (?,?,?,?) ON CONFLICT DO NOTHING',(pid,label,value,order))

def run():
    with database() as db:
        refine_batch(db)
    print('Photographies sources approuvées et caractéristiques vérifiées appliquées.')

if __name__=='__main__':
    run()
