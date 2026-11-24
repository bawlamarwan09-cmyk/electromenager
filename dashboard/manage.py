"""Private catalogue manager. Run 'python dashboard/manage.py --help'."""
from interface import shell, summary, listing
import argparse
import contextlib
import datetime
import getpass
import hashlib
import hmac
import html
import json
import os
from pathlib import Path
import secrets
import sqlite3
import time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlencode, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = sorted((ROOT / 'database').glob('[0-9]*.sql'))
PG = os.environ.get('DATABASE_URL')
ORIGIN = os.environ.get('DASHBOARD_ORIGIN', 'http://127.0.0.1:8100').rstrip('/')
ESC = lambda value: html.escape(str(value), quote=True)
LABELS = dict(catalogue_universe='Univers', category='Catégories', brand='Marques',
              product='Produits', product_specification='Caractéristiques', product_comparison='Comparaisons',
              article='Articles', article_section='Sections', article_source='Sources',
              article_product='Produits des articles', article_category='Catégories des articles',
              article_brand='Marques des articles', promotion='Promotions', promotion_product='Produits en promotion')
FIELDS = dict(id='Identifiant', slug='Slug URL', name='Nom', title='Titre', topic='Thème',
              category_id='Catégorie', brand_id='Marque', product_id='Produit', article_id='Article',
              universe_id='Univers', promotion_id='Promotion', product_a_id='Premier modèle',
              product_b_id='Deuxième modèle', stock_active='Suivi du stock', stock_quantity='Quantité en stock',
              percent_off='Remise (%)', starts_on='Début (inclus)', ends_on='Fin (incluse)', active='Activation',
              price_centimes='Prix en centimes de DH', image_key='Image', status='Statut', sku='Référence',
              advice='Conseil', guide_slug='Slug du guide principal', value='Valeur', label='Libellé',
              display_order='Ordre', heading='Sous-titre', body='Texte', url='Lien source')
FLAGS = {'active', 'stock_active'}
STYLE = Path(__file__).with_name('admin.css').read_text()
NAV_LABELS = dict(LABELS, home='Vue d’ensemble', stock='Stock')
FIELDS.update(availability='Disponibilité', position='Ordre')

@contextlib.contextmanager
def database():
    if PG:
        import psycopg
        conn = psycopg.connect(PG)
    else:
        file = Path(os.environ.get('DASHBOARD_DB', Path.home() / '.aura-volt' / 'catalogue.sqlite'))
        file.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        conn = sqlite3.connect(file)
        conn.execute('PRAGMA foreign_keys=ON')
    try:
        yield conn
        conn.commit()
    except BaseException:
        conn.rollback()
        raise
    finally:
        conn.close()

def query(conn, sql, values=()):
    return conn.execute(sql.replace('?', '%s') if PG else sql, values)

def script(conn, path):
    if PG:
        conn.execute(path.read_text())
    else:
        conn.executescript(path.read_text())

def metadata():
    with sqlite3.connect(':memory:') as db:
        for path in SCHEMA:
            db.executescript(path.read_text())
        data = {}
        for table in LABELS:
            columns = db.execute(f'pragma table_info({table})').fetchall()
            keys = [c[1] for c in sorted(columns,key=lambda c:c[5]) if c[5]]
            refs = {r[3]:(r[2],r[4]) for r in db.execute(f'pragma foreign_key_list({table})') if r[4]=='id'}
            data[table] = (columns, keys, refs)
        return data

META = metadata()

def password_hash(password, salt):
    return hashlib.scrypt(password.encode(), salt=bytes.fromhex(salt), n=32768,r=8,p=1,maxmem=64*1024**2).hex()

def digest(token):
    return hashlib.sha256(token.encode()).hexdigest()

def href(table, keys):
    return '/edit?' + html.escape(urlencode({'table':table, **{'k_'+k:v for k,v in keys.items()}}))

class Dashboard(BaseHTTPRequestHandler):
    def respond(self, body, status=200, redirect=None, cookie=None):
        if not redirect and not body.startswith('<div class="layout">'):
            body='<main class="panel"><div class="brand">Aura <b>Volt</b></div>'+body+'</main>'
        payload = ('<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aura Volt · Administration</title><style>'+STYLE+'</style><body>'+body+'</body></html>').encode()
        self.send_response(status)
        self.send_header('Content-Type','text/html; charset=utf-8')
        self.send_header('Cache-Control','no-store')
        self.send_header('Content-Security-Policy',"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")
        if redirect: self.send_header('Location',redirect)
        if cookie is not None:
            self.send_header('Set-Cookie','av_session='+cookie+'; Path=/; HttpOnly; SameSite=Strict'+('; Secure' if ORIGIN.startswith('https://') else '')+('; Max-Age=0' if not cookie else ''))
        self.send_header('Content-Length',str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def session(self, db):
        cookies = SimpleCookie()
        cookies.load(self.headers.get('Cookie',''))
        token = cookies['av_session'].value if 'av_session' in cookies else ''
        return query(db,'SELECT u.id FROM dashboard_session s JOIN dashboard_user u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1',(digest(token),int(time.time()))).fetchone(),token

    def do_GET(self):
        url=urlsplit(self.path)
        args=dict((k,v[0]) for k,v in parse_qs(url.query).items())
        with database() as db:
            user,_=self.session(db)
            if not user:
                return self.respond('<h1>Connexion</h1><form action="/login" method="post"><label>E-mail<input type="email" name="email" required></label><label>Mot de passe<input type="password" name="password" required></label><button>Se connecter</button></form>')
            table=args.get('table','home' if url.path=='/' else 'product')
            if url.path=='/' and table in ('home','stock'):
                content=summary(db,query,NAV_LABELS) if table=='home' else ''
                content+=listing(db,query,'product' if table=='home' else 'stock',META,FIELDS,NAV_LABELS,href,'Produits du catalogue' if table=='home' else None)
                return self.respond(shell(content,table,NAV_LABELS))
            if table not in META: return self.respond('Introuvable',404)
            columns,keys,refs=META[table]
            if url.path=='/edit':
                keyvals={k:args['k_'+k] for k in keys if 'k_'+k in args}
                row=None
                if keyvals:
                    if len(keyvals)!=len(keys): return self.respond('Clé incomplète',400)
                    row=query(db,f"SELECT * FROM {table} WHERE "+' AND '.join(k+'=?' for k in keys),tuple(keyvals.values())).fetchone()
                    if not row: return self.respond('Introuvable',404)
                content=self.editor(db,table,columns,refs,row,keyvals)
            elif url.path=='/':
                content=listing(db,query,table,META,FIELDS,NAV_LABELS,href)
            else: return self.respond('Introuvable',404)
            self.respond(shell(content,table,NAV_LABELS))

    def editor(self,db,table,columns,refs,row,keys):
        def hidden(k,v): return f'<input type="hidden" name="{ESC(k)}" value="{ESC(v)}">'
        identity=hidden('table',table)+''.join(hidden('k_'+k,v) for k,v in keys.items())
        action='Modifier' if row else 'Ajouter'
        out=f'<p><a href="/?table={table}">{LABELS[table]}</a></p><h1>{action} · {LABELS[table]}</h1><form class="editor" action="/save" method="post">'+identity
        if row:
            out+=hidden('version',digest(json.dumps(list(row),default=str)))
        for i,(_,name,kind,required,default,_) in enumerate(columns):
            value=row[i] if row else (str(default).strip("'") if default is not None else '')
            value='' if value is None else str(value)
            options=None
            if name in refs:
                target,col=refs[name]
                title='title' if target=='article' else 'name'
                options=query(db,f'SELECT {col},{title} FROM {target} ORDER BY {title}').fetchall()
            elif name in FLAGS: options=[('0','Désactivé'),('1','Activé')]
            elif name=='status': options=[('draft','Brouillon'),('published','Publié'),('archived','Archivé')]
            if name=='id' and not row: value=secrets.token_hex(12)
            attr=f'name="{name}"'+(' required' if required else '')
            if options is not None:
                field=f'<select {attr}><option value="">Choisir…</option>'+''.join(f'<option value="{ESC(k)}"'+(' selected' if str(k)==value else '')+f'>{ESC(v)}</option>' for k,v in options)+'</select>'
            elif name in ('description','body','notes','advice','introduction'):
                field=f'<textarea {attr}>{ESC(value)}</textarea>'
            else:
                typ='number' if kind.upper()=='INTEGER' else 'date' if kind.upper()=='DATE' else 'text'
                field=f'<input type="{typ}" {attr} value="{ESC(value)}">'
            out+=f'<label>{ESC(FIELDS.get(name,name.capitalize()))}{field}</label>'
        out+='<div class="actions"><button>Enregistrer</button>'
        if row: out+=' <label><input type="checkbox" name="confirm" value="yes">Confirmer la suppression</label><button class="danger" formaction="/delete" formnovalidate>Supprimer</button>'
        return out+'</div></form>'

    def do_POST(self):
        if self.headers.get('Origin')!=ORIGIN: return self.respond('Origine refusée',403)
        size=int(self.headers.get('Content-Length','0'))
        if not 0<size<=200000 and self.path!='/logout': return self.respond('Formulaire invalide',400)
        form={k:v[0] for k,v in parse_qs(self.rfile.read(max(0,min(size,200000))).decode(),keep_blank_values=True).items()}
        try:
            with database() as db:
                if self.path=='/login':
                    record=query(db,'SELECT id,password_hash FROM dashboard_user WHERE email=? AND active=1',(form.get('email','').strip().lower(),)).fetchone()
                    salt,expected=record[1].split(':') if record else ('00'*16,'00'*64)
                    if not hmac.compare_digest(password_hash(form.get('password',''),salt),expected) or not record:
                        return self.respond('Identifiants incorrects. <a href="/">Réessayer</a>',401)
                    token=secrets.token_urlsafe(32)
                    query(db,'DELETE FROM dashboard_session WHERE expires_at<=?',(int(time.time()),))
                    query(db,'INSERT INTO dashboard_session VALUES (?,?,?)',(digest(token),record[0],int(time.time())+28800))
                    db.commit()
                    return self.respond('',303,'/',token)
                user,token=self.session(db)
                if not user: return self.respond('Connexion requise',401)
                if self.path=='/logout':
                    query(db,'DELETE FROM dashboard_session WHERE token_hash=?',(digest(token),));db.commit()
                    return self.respond('',303,'/','')
                table=form['table']; columns,keys,_=META[table]
                names=[c[1] for c in columns]
                ids=[form['k_'+k] for k in keys if 'k_'+k in form]
                where=' AND '.join(k+'=?' for k in keys)
                if ids:
                    if len(ids)!=len(keys): raise ValueError()
                    if not PG: db.execute('BEGIN IMMEDIATE')
                    row=query(db,f'SELECT * FROM {table} WHERE '+where+(' FOR UPDATE' if PG else ''),ids).fetchone()
                    if not row or digest(json.dumps(list(row),default=str))!=form.get('version'): return self.respond('Fiche modifiée. Rechargez avant de continuer.',409)
                if self.path=='/delete' and ids and form.get('confirm')=='yes':
                    query(db,f'DELETE FROM {table} WHERE '+where,ids)
                elif self.path=='/save':
                    values=[]
                    for _,name,kind,required,_,_ in columns:
                        raw=form[name].strip()
                        if required and not raw: raise ValueError()
                        val=None if not raw else int(raw) if kind.upper()=='INTEGER' else raw
                        if kind.upper()=='DATE': datetime.date.fromisoformat(raw)
                        values.append(val)
                    if ids: query(db,f'UPDATE {table} SET '+','.join(n+'=?' for n in names)+' WHERE '+where,values+ids)
                    else: query(db,f'INSERT INTO {table} ('+','.join(names)+') VALUES ('+','.join('?' for _ in names)+')',values)
                else: return self.respond('Action à confirmer',400)
                db.commit()
                self.respond('',303,'/?table='+table)
        except Exception as error:
            if isinstance(error,(ValueError, KeyError,sqlite3.IntegrityError)) or (getattr(error,'sqlstate','') or '')[:2] in ('22','23'):
                return self.respond('Vérifiez les champs, les doublons et les fiches liées. <a href="/">Retour</a>',400)
            raise

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('command',choices=['init','create-admin','serve'])
    parser.add_argument('--demo',action='store_true')
    args=parser.parse_args()
    if args.command=='serve':
        ThreadingHTTPServer(('127.0.0.1',int(os.environ.get('DASHBOARD_PORT','8100'))),Dashboard).serve_forever()
    else:
        with database() as db:
            if args.command=='init':
                for path in SCHEMA+([ROOT/'database/demo.sql',ROOT/'database/demo_articles.sql'] if args.demo else []): script(db,path)
            else:
                email=input('E-mail administrateur : ').strip().lower()
                pwd=getpass.getpass('Mot de passe (12 caractères minimum) : ')
                if len(pwd)<12 or '@' not in email: raise SystemExit('Identifiants invalides')
                salt=secrets.token_hex(16)
                query(db,'INSERT INTO dashboard_user (id,email,password_hash) VALUES (?,?,?)',(secrets.token_hex(16),email,salt+':'+password_hash(pwd,salt)))
