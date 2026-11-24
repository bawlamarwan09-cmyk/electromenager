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
        db.execute('BEGIN')
        yield db

def snapshot(db):
    families = [dict(slug=s,name=n,univers=u,advice=a,guide=g) for s,n,u,a,g in db.execute("""
        SELECT c.slug,c.name,u.slug,c.advice,c.guide_slug FROM category c
        JOIN catalogue_universe u ON u.id=c.universe_id ORDER BY c.name,c.id""")]
    specs = {}
    for pid,label,value in db.execute('SELECT product_id,label,value FROM product_specification ORDER BY product_id,display_order,label'):
        specs.setdefault(pid,{})[label]=value
    products = []
    for pid,slug,name,category,family,brand,image,description,price,original,discount in db.execute("""
        SELECT p.id,p.slug,p.name,c.name,c.slug,b.slug,p.image_key,p.description,
               o.final_price_centimes,o.price_centimes,o.percent_off FROM product p
        JOIN category c ON c.id=p.category_id JOIN brand b ON b.id=p.brand_id
        JOIN catalogue_offer o ON o.product_id=p.id WHERE p.status='published' ORDER BY p.name,p.id"""):
        products.append(dict(slug=slug,name=name,category=category,family=family,brand=brand,image=image or '',
            description=description,specs=specs.get(pid,{}),price=None if price is None else price/100,
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
