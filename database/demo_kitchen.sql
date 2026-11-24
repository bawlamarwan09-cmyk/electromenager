BEGIN;
INSERT INTO category (id,universe_id,slug,name) VALUES
 ('machines-a-cafe','petit','machines-a-cafe','Machines à café'),
 ('appareils-a-panini','petit','appareils-a-panini','Appareils à panini')
ON CONFLICT DO NOTHING;
INSERT INTO product (id,brand_id,category_id,slug,sku,name,description,image_key,price_centimes,status) VALUES
 ('AV-E01','alvoria','machines-a-cafe','barista-one','AV-E01','Barista One','Machine à espresso avec broyeur intégré.','/images/kitchen/espresso.webp',249000,'published'),
 ('AV-E02','novelys','machines-a-cafe','espresso-compact','AV-E02','Espresso Compact','Un format compact pour votre plan de travail.','/images/kitchen/compact.webp',179000,'published'),
 ('AV-E03','alvoria','machines-a-cafe','espresso-retro','AV-E03','Espresso Rétro','Une finition crème pour votre coin café.','/images/kitchen/retro.webp',219000,'published'),
 ('AV-P01','alvoria','appareils-a-panini','grill-duo','AV-P01','Grill Duo','Presse à panini à plaques rainurées.','/images/kitchen/panini.webp',59000,'published'),
 ('AV-P02','novelys','appareils-a-panini','grill-inox','AV-P02','Grill Inox','Un gril de comptoir en finition inox.','/images/kitchen/grill.webp',69000,'published')
ON CONFLICT DO NOTHING;
COMMIT;
