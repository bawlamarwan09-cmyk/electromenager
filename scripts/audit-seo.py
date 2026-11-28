"""Audit the static HTML actually shipped, excluding redirects and error pages."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from collections import Counter
import json
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'out'
class Page(HTMLParser):
    def __init__(self):super().__init__();self.h1=0;self.title='';self.description='';self.canonical='';self.robots='';self.intitle=False;self.schemas=[];self.in_schema=False;self.schema='';self.links=[];self.images=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1':self.h1+=1
        if tag=='title':self.intitle=True
        if tag=='meta' and a.get('name')=='description':self.description=a.get('content','')
        if tag=='meta' and a.get('name')=='robots':self.robots=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','')
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='img':self.images.append(a)
        if tag=='script' and a.get('type')=='application/ld+json':self.in_schema=True;self.schema=''
    def handle_data(self,text):
        if self.intitle:self.title+=text
        if self.in_schema:self.schema+=text
    def handle_endtag(self,tag):
        if tag=='title':self.intitle=False
        if tag=='script' and self.in_schema:self.schemas.append(json.loads(self.schema));self.in_schema=False
pages=[];broken=set()
for file in OUT.rglob('*.html'):
    rel=file.relative_to(OUT).as_posix()
    if rel.startswith('_') or rel in ('404.html','404/index.html'):continue
    p=Page();p.feed(file.read_text())
    if not p.h1:continue # exported redirect stubs
    path='/'+rel.removesuffix('index.html');pages.append((path,p))
    for link in p.links:
        if link.startswith('/') and not link.startswith('//'):
            target=OUT/unquote(urlsplit(link).path).lstrip('/')
            if not target.is_file() and not (target/'index.html').is_file():broken.add(link)
assert pages,'No exported pages'
for path,p in pages:
    assert p.h1==1,(path,'H1',p.h1)
    assert p.title and p.description and p.canonical,(path,'missing metadata')
    assert p.schemas,(path,'missing schema')
    for image in p.images:assert 'alt' in image,(path,'image without alt attribute')
assert not broken,broken
for name,items in [('titles',[p.title for _,p in pages]),('descriptions',[p.description for _,p in pages])]:
    duplicates=[v for v,n in Counter(items).items() if n>1]
    assert not duplicates,(name,'duplicates',duplicates[:5])
assert (OUT/'sitemap.xml').exists() and (OUT/'robots.txt').exists()
print(json.dumps(dict(content_pages=len(pages),unique_titles=len({p.title for _,p in pages}),unique_descriptions=len({p.description for _,p in pages}),canonical_pages=sum(bool(p.canonical) for _,p in pages),structured_data_pages=sum(bool(p.schemas) for _,p in pages),broken_internal_links=len(broken),images_with_empty_alt=sum(not a.get('alt') for _,p in pages for a in p.images)),indent=2))
