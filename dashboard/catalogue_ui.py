"""Simple category-first catalogue screens; advanced tables remain available."""
from html import escape as esc
from urllib.parse import urlencode

def home(db,query):
    rows=query(db,'''SELECT c.id,c.name,count(p.id),min(p.image_key) FROM category c LEFT JOIN product p ON p.category_id=c.id GROUP BY c.id,c.name ORDER BY c.name''').fetchall()
    cards=''
    for key,name,count,image in rows:
        image=f'<img src="{esc(image,quote=True)}" alt="" loading="lazy">' if image and image.startswith(('/images/','https://')) else '<span class="category-symbol">▦</span>'
        cards+=f'<a class="category-card" href="/?{urlencode(dict(table="product",category=key))}">{image}<strong>{esc(name)}</strong><span>{count} produit(s)</span></a>'
    return '<div class="heading"><div><h1>Votre catalogue</h1><p>Choisissez une catégorie pour gérer ses produits.</p></div><a class="button" href="/edit?table=category">+ Nouvelle catégorie</a></div><div class="category-cards">'+cards+'</div>'

def products(db,query,args,href):
    category=args.get('category','');q=args.get('q','').strip();brand=args.get('brand','');status=args.get('status','');stock=args.get('stock','')
    clauses=[];values=[]
    for col,val in [('category_id',category),('brand_id',brand),('status',status)]:
        if val:clauses.append('p.'+col+'=?');values.append(val)
    if q:clauses.append('(lower(p.name) LIKE ? OR lower(p.sku) LIKE ?)');values.extend(['%'+q.lower()+'%']*2)
    availability={'in':'p.stock_active=1 AND p.stock_quantity>0','out':'p.stock_active=1 AND p.stock_quantity=0','unknown':'p.stock_active=0'}
    if stock in availability:clauses.append(availability[stock])
    rows=query(db,'''SELECT p.id,p.name,p.sku,p.image_key,p.price_centimes,p.status,p.stock_active,p.stock_quantity,b.name FROM product p JOIN brand b ON b.id=p.brand_id'''+(' WHERE '+' AND '.join(clauses) if clauses else '')+' ORDER BY p.name,p.id',values).fetchall()
    categories=query(db,'SELECT id,name FROM category ORDER BY name').fetchall();brands=query(db,'SELECT id,name FROM brand ORDER BY name').fetchall()
    def select(name,label,options,current):return f'<label>{label}<select name="{name}"><option value="">Tous</option>'+''.join(f'<option value="{esc(str(k),quote=True)}"'+(' selected' if str(k)==current else '')+f'>{esc(v)}</option>' for k,v in options)+'</select></label>'
    title=dict(categories).get(category,'Tous les produits')
    out='<p><a href="/">Catégories</a></p><div class="heading"><h1>'+esc(title)+'</h1><a class="button" href="/edit?'+urlencode(dict(table='product',category=category))+'">+ Nouveau produit</a></div>'
    out+='<form method="get" class="catalogue-filters"><input type="hidden" name="table" value="product"><label>Rechercher<input name="q" value="'+esc(q,quote=True)+'" placeholder="Nom ou référence"></label>'+select('category','Catégorie',categories,category)+select('brand','Marque',brands,brand)+select('status','Publication',[('published','Publié'),('draft','Brouillon'),('archived','Archivé')],status)+select('stock','Stock',[('in','Disponible'),('out','Rupture'),('unknown','À confirmer')],stock)+'<button>Filtrer</button><a href="/?'+urlencode(dict(table='product',category=category))+'">Effacer les filtres</a></form>'
    out+=f'<p>{len(rows)} produit(s)</p><div class="scroll"><table><thead><tr><th>Produit</th><th>Marque</th><th>Prix</th><th>Stock</th><th>Publication</th><th>Action</th></tr></thead><tbody>'
    for pid,name,sku,image,price,state,active,quantity,brand_name in rows:
        image=f'<img src="{esc(image,quote=True)}" alt="" loading="lazy">' if image and image.startswith(('/images/','https://')) else ''
        path=href('product',{'id':pid});price='Sur demande' if price is None else f'{price/100:.2f} DH';stock_text='À confirmer' if not active else f'{quantity} disponible(s)' if quantity else 'Rupture'
        out+=f'<tr><td><a class="product-cell" href="{path}">{image}<span>{esc(name)}<small>{esc(sku)}</small></span></a></td><td>{esc(brand_name)}</td><td>{price}</td><td>{stock_text}</td><td>'+{'published':'Publié','draft':'Brouillon','archived':'Archivé'}[state]+f'</td><td><a href="{path}">Modifier</a></td></tr>'
    return out+'</tbody></table></div>'

def product_editor(db,query,columns,row,keys,href,digest,prefill):
    import json,secrets
    data=dict(zip([c[1] for c in columns],row)) if row else dict(id=secrets.token_hex(12),category_id=prefill.get('category',''),status='draft',stock_active=0,stock_quantity=0)
    def hidden(k,v):return f'<input type="hidden" name="{k}" value="{esc(str(v or ""),quote=True)}">'
    def field(name,label,kind='text',required=False):
        value=data.get(name,'');value='' if value is None else value
        if name=='price_dh':value='' if data.get('price_centimes') is None else f"{data['price_centimes']/100:.2f}"
        if name in ('brand_id','category_id','status','stock_active'):
            options=query(db,'SELECT id,name FROM '+('brand' if name=='brand_id' else 'category')+' ORDER BY name').fetchall() if name.endswith('_id') else [('draft','Brouillon'),('published','Publié'),('archived','Archivé')] if name=='status' else [(0,'À confirmer'),(1,'Stock suivi')]
            control=f'<select name="{name}"'+(' required' if required else '')+'><option value="">Choisir…</option>'+''.join(f'<option value="{esc(str(k),quote=True)}"'+(' selected' if str(k)==str(value) else '')+f'>{esc(v)}</option>' for k,v in options)+'</select>'
        elif kind=='textarea':control=f'<textarea name="{name}" rows="8">{esc(str(value))}</textarea>'
        else:control=f'<input name="{name}" type="{kind}" value="{esc(str(value),quote=True)}"'+(' required' if required else '')+(' min="0" step="0.01"' if name=='price_dh' else ' min="0" step="1"' if name=='stock_quantity' else '')+'>'
        return f'<label>{label}{control}</label>'
    out='<p><a href="/?'+urlencode(dict(table='product',category=data.get('category_id','')))+'">Retour aux produits</a></p><h1>'+('Modifier le produit' if row else 'Nouveau produit')+'</h1><form class="editor product-editor" action="/save" method="post">'+hidden('table','product')+hidden('simple_product','1')
    for key in ('id','slug'):out+=hidden(key,data.get(key,''))
    for key,value in keys.items():out+=hidden('k_'+key,value)
    if row:out+=hidden('version',digest(json.dumps(list(row),default=str)))
    out+='<h2>Informations du produit</h2>'+field('name','Nom du produit',required=True)+field('sku','Référence / SKU')+field('category_id','Catégorie',required=True)+field('brand_id','Marque',required=True)+field('description','Description','textarea')+'<h2>Photo, prix et disponibilité</h2>'+field('image_key','Lien de la photo principale')+field('price_dh','Prix en DH — vide = sur demande','number')+field('status','Publication',required=True)+field('stock_active','Gestion du stock',required=True)+field('stock_quantity','Quantité disponible','number')+'<div class="actions"><button>Enregistrer le produit</button></div>'
    if row:out+='<details class="delete-product"><summary>Supprimer ce produit</summary><p>Cette action supprime la fiche et ses associations.</p><label><input type="checkbox" name="confirm" value="yes"> Je confirme la suppression</label><button class="danger" formaction="/delete" formnovalidate>Supprimer le produit</button></details>'
    out+='</form>'
    if row:
        pid=data['id'];out+='<section class="product-related"><h2>Photos supplémentaires et caractéristiques</h2>'
        for table,title,fields in [('product_image','Photos',('id','alt_text','image_url')),('product_specification','Caractéristiques',('label','label','value'))]:
            out+='<h3>'+title+'</h3><a class="button" href="/edit?'+urlencode(dict(table=table,product_id=pid))+'">+ Ajouter</a><ul>'
            for key,label,value in query(db,'SELECT '+','.join(fields)+' FROM '+table+' WHERE product_id=?',(pid,)).fetchall():
                ids={'id':key} if table=='product_image' else {'product_id':pid,'label':key}
                out+='<li>'+esc(label or value)+' <a href="'+href(table,ids)+'">Modifier / supprimer</a></li>'
            out+='</ul>'
        out+='</section>'
    return out
