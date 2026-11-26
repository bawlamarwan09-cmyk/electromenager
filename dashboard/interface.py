from html import escape
from urllib.parse import urlencode

GROUPS = {
    'Catalogue': ('product','category','brand','catalogue_universe','product_specification','product_comparison','product_image'),
    'Commerce': ('stock','promotion','promotion_product'),
    'Éditorial': ('article','article_section','article_source','article_product','article_category','article_brand'),
}
COLUMNS = {
    'product_image': ('product_id','alt_text','display_order'),
    'product': ('name','brand_id','sku','price_centimes','status'),
    'stock': ('name','sku','stock_quantity','availability'),
    'promotion': ('name','percent_off','starts_on','ends_on','active'),
    'article': ('title','topic','status'), 'category': ('name','universe_id','slug'),
    'brand': ('name','slug'), 'catalogue_universe': ('name','slug'),
    'product_specification': ('product_id','label','value'),
    'product_comparison': ('product_a_id','product_b_id','category_id'),
    'article_section': ('article_id','position','heading'), 'article_source': ('label','article_id'),
    'article_product': ('article_id','product_id'), 'article_category': ('article_id','category_id'),
    'article_brand': ('article_id','brand_id'), 'promotion_product': ('promotion_id','product_id'),
}
def url(key):
    return '/' if key=='home' else '/?'+urlencode({'table':key})

def shell(content, active, labels):
    def link(key):
        current=' aria-current="page"' if key==active else ''
        return f'<a href="{url(key)}"{current}>{labels[key]}</a>'
    items='<nav aria-label="Navigation principale">'+link('home')
    for group,keys in GROUPS.items():
        items+=f'<h2>{group}</h2>'+''.join(link(key) for key in keys)
    items+='</nav><form action="/logout" method="post"><button class="signout">Déconnexion</button></form>'
    return ('<div class="layout"><aside><div class="brand">Aura <b>Volt</b></div>'
            '<div class="desktop">'+items+'</div><details class="mobile"><summary>Menu du dashboard</summary>'
            +items+'</details></aside><main class="workspace">'+content+'</main></div>')

def summary(db, query, labels):
    counts=[('product','SELECT count(*) FROM product','Produits'),
            ('stock','SELECT count(*) FROM product WHERE stock_active=1 AND stock_quantity=0','En rupture'),
            ('promotion','SELECT count(*) FROM promotion WHERE active=1 AND CURRENT_DATE BETWEEN starts_on AND ends_on','Promotions en cours'),
            ('article',"SELECT count(*) FROM article WHERE status='draft'",'Articles en brouillon')]
    cards=''.join(f'<a class="metric" href="{url(k)}"><span>{label}</span><strong>{query(db,sql).fetchone()[0]}</strong></a>' for k,sql,label in counts)
    return '<h1>Vue d’ensemble</h1><div class="metrics">'+cards+'</div>'

def listing(db,query,table,meta,fields,labels,href,heading=None):
    source='product' if table=='stock' else table
    columns,keys,refs=meta[source]
    names=[c[1] for c in columns]
    shown=COLUMNS[table]
    rows=query(db,f"SELECT * FROM {source} ORDER BY "+','.join(keys)).fetchall()
    lookup={}
    for field in shown:
        if field in refs:
            target,_=refs[field]
            caption='title' if target=='article' else 'name'
            lookup[field]=dict(query(db,f'SELECT id,{caption} FROM {target}').fetchall())
    def cell(field):
        value=data.get(field)
        if field=='availability':
            return 'À confirmer' if not data['stock_active'] else 'Disponible' if data['stock_quantity'] else 'Rupture'
        if field=='price_centimes': return 'Sur demande' if value is None else f'{value/100:,.2f} DH'.replace(',',' ')
        if field=='status': return {'draft':'Brouillon','published':'Publié','archived':'Archivé'}[value]
        if field=='active': return 'Activée' if value else 'Désactivée'
        if field=='percent_off': return f'{value} %'
        return str(lookup.get(field,{}).get(value,value) if value is not None else '—')
    title=heading or labels[table]
    tag='h2' if heading else 'h1'
    action='' if table=='stock' else f'<a class="button" href="{href(source,{})}">+ Ajouter</a>'
    out=f'<div class="heading"><{tag}>{title}</{tag}>{action}</div>'
    if not rows: return out+'<p class="empty">Aucune fiche pour le moment.</p>'
    out+='<div class="scroll"><table><thead><tr>'+''.join(f'<th scope="col">{fields.get(f,f.capitalize())}</th>' for f in shown)+'</tr></thead><tbody>'
    for row in rows:
        data=dict(zip(names,row))
        path=href(source,{k:data[k] for k in keys})
        cells=[escape(cell(f)) for f in shown]
        cells[0]=f'<a href="{path}">{cells[0]}</a>'
        out+='<tr>'+''.join(f'<td>{v}</td>' for v in cells)+'</tr>'
    return out+'</tbody></table></div>'
