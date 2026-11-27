"""Export only published catalogue data for Next.js, including effective promotions."""
import contextlib
import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import time

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'lib/storefront.generated.json'

@contextlib.contextmanager
def connect():
    path = Path(os.environ.get('DASHBOARD_DB', Path.home()/'.aura-volt/catalogue.sqlite'))
    if os.environ.get('DATABASE_URL'):
        import psycopg
        with psycopg.connect(os.environ['DATABASE_URL']) as db:
            db.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
            yield db
        return
    demo = not path.exists()
    if demo and 'DASHBOARD_DB' in os.environ:
        raise FileNotFoundError(path)
    with contextlib.closing(sqlite3.connect(':memory:' if demo else path.resolve().as_uri()+'?mode=ro', uri=not demo)) as db:
        if demo:
            for script in [*sorted((ROOT/'database').glob('[0-9]*.sql')), ROOT/'database/demo.sql', ROOT/'database/demo_offers.sql', ROOT/'database/demo_kitchen.sql']:
                db.executescript(script.read_text())
            sys.path.insert(0,str(ROOT/'dashboard'))
            from import_photos import import_batch
            import_batch(db,publish=True)
            db.commit()
        db.execute('BEGIN')
        yield db

def snapshot(db):
    families = [dict(slug=s,name=n,univers=u,advice=a,guide=g) for s,n,u,a,g in db.execute("""
        SELECT c.slug,c.name,u.slug,c.advice,c.guide_slug FROM category c
        JOIN catalogue_universe u ON u.id=c.universe_id ORDER BY c.name,c.id""")]
    specs = {}
    for pid,label,value in db.execute('SELECT product_id,label,value FROM product_specification ORDER BY product_id,display_order,label'):
        specs.setdefault(pid,{})[label]=value
    has_gallery = db.execute("SELECT 1 FROM information_schema.tables WHERE table_name='product_image'").fetchone() if os.environ.get('DATABASE_URL') else db.execute("SELECT 1 FROM sqlite_master WHERE name='product_image' AND type='table'").fetchone()
    galleries={}
    if has_gallery:
        for pid,url,alt in db.execute('SELECT product_id,image_url,alt_text FROM product_image ORDER BY display_order,id'):
            galleries.setdefault(pid,[]).append(dict(url=url,alt=alt))
    reviewed_path=ROOT/'database/imports/verified-product-details.json'
    reviewed=json.loads(reviewed_path.read_text()) if reviewed_path.exists() else {}
    photo_review=ROOT/'database/imports/product-image-sourcing-review.json'
    sourced={p['product_id']:p.get('accepted_images',[]) for p in json.loads(photo_review.read_text()).get('products',[])} if photo_review.exists() else {}
    products = []
    for pid,slug,name,category,family,brand,image,description,price,original,discount,availability in db.execute("""
        SELECT p.id,p.slug,p.name,c.name,c.slug,b.slug,p.image_key,p.description,
               o.final_price_centimes,o.price_centimes,o.percent_off,o.availability FROM product p
        JOIN category c ON c.id=p.category_id JOIN brand b ON b.id=p.brand_id
        JOIN catalogue_offer o ON o.product_id=p.id WHERE p.status='published' AND (p.id LIKE 'REAL-%' OR NOT EXISTS
            (SELECT 1 FROM product real_product WHERE real_product.id LIKE 'REAL-%' AND real_product.status='published')) ORDER BY p.name,p.id"""):
        sources=list(reviewed.get(pid,{}).get('sources',[]))
        sources.extend(dict(label='Source de la photographie du produit',url=photo['source_page']) for photo in sourced.get(pid,[]))
        sources=list({source['url']:source for source in sources}.values())
        gallery=galleries.get(pid,[])
        if pid.startswith('REAL-'):
            approved_urls={photo['url'] for photo in sourced.get(pid,[])}
            gallery=[photo for photo in gallery if not photo['url'].startswith('/images/catalogue-sourced/') or photo['url'] in approved_urls]
            if image and image.startswith('/images/catalogue-sourced/') and image not in approved_urls:
                image=''
            # Prefer approved studio photos. Retain the supplied shop photo
            # when it is the only available visual, rather than hiding it.
            originals=[photo for photo in gallery if photo['url'].startswith('/images/catalogue-real/')]
            sources.extend(dict(label='Photo d’identification du produit',url=photo['url']) for photo in originals)
            alternatives=[photo for photo in gallery if not photo['url'].startswith('/images/catalogue-real/')]
            if alternatives:
                gallery=alternatives
                if not image or image.startswith('/images/catalogue-real/'):
                    image=gallery[0]['url']
            elif not image and originals:
                image=originals[0]['url']
        if image and image.startswith('/images/catalogue-sourced/'):
            sources.extend(dict(label='Photo originale — emballage et identification',url=photo['url']) for photo in gallery if photo['url'].startswith('/images/catalogue-real/'))
            gallery=[dict(url=image,alt=name)]+[photo for photo in gallery if photo['url']!=image and not photo['url'].startswith('/images/catalogue-real/')]
        sources=list({source['url']:source for source in sources}.values())
        products.append(dict(slug=slug,name=name.split(" · lot ")[0],category=category,family=family,brand=brand,image=image or '',
            description=description,availability=availability,sources=sources,images=gallery,isDemo=not pid.startswith('REAL-'),specs=specs.get(pid,{}),price=None if price is None else price/100,
            originalPrice=None if original is None else original/100,discount=discount))
    return dict(families=families,products=products,brands=dict(db.execute('SELECT slug,name FROM brand ORDER BY slug')),
                universes=dict(db.execute('SELECT slug,name FROM catalogue_universe ORDER BY slug')))

def export():
    with connect() as db:
        content=json.dumps(snapshot(db),ensure_ascii=False,indent=2)+'\n'
    if TARGET.exists() and TARGET.read_text()==content:
        return
    with tempfile.NamedTemporaryFile('w',dir=TARGET.parent,delete=False) as file:
        file.write(content)
    os.replace(file.name,TARGET)

if __name__=='__main__':
    export()
    while '--watch' in sys.argv:
        time.sleep(2)
        try:
            export()
        except Exception as error:
            print(f'Actualisation du catalogue : {error}',file=sys.stderr,flush=True)
