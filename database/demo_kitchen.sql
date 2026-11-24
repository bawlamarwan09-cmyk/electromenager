BEGIN;
INSERT INTO category (id,universe_id,slug,name) VALUES
 ('televiseurs','gros','televiseurs','Téléviseurs'),
 ('bouilloires','petit','bouilloires','Bouilloires'),
 ('blenders','petit','blenders','Blenders'),
 ('machines-a-cafe','petit','machines-a-cafe','Machines à café'),
 ('appareils-a-panini','petit','appareils-a-panini','Appareils à panini')
ON CONFLICT DO NOTHING;
INSERT INTO product (id,brand_id,category_id,slug,sku,name,description,image_key,price_centimes,status) VALUES
 ('AV-TV01','alvoria','televiseurs','vision-55','AV-TV01','Vision 55','Téléviseur de démonstration, écran de 55 pouces.','/images/kitchen/tv.webp',429000,'published'),
 ('AV-B01','novelys','bouilloires','bouilloire-cuivre','AV-B01','Bouilloire Cuivre','Bouilloire électrique de comptoir.','/images/kitchen/kettle.webp',49000,'published'),
 ('AV-M01','alvoria','blenders','blender-verre','AV-M01','Blender Verre','Blender de comptoir avec bol en verre.','/images/kitchen/blender.webp',79000,'published'),
 ('AV-E01','alvoria','machines-a-cafe','barista-one','AV-E01','Barista One','Machine à espresso avec broyeur intégré.','/images/kitchen/espresso.webp',249000,'published'),
 ('AV-E02','novelys','machines-a-cafe','espresso-compact','AV-E02','Espresso Compact','Un format compact pour votre plan de travail.','/images/kitchen/compact.webp',179000,'published'),
 ('AV-E03','alvoria','machines-a-cafe','espresso-retro','AV-E03','Espresso Rétro','Une finition crème pour votre coin café.','/images/kitchen/retro.webp',219000,'published'),
 ('AV-P01','alvoria','appareils-a-panini','grill-duo','AV-P01','Grill Duo','Presse à panini à plaques rainurées.','/images/kitchen/panini.webp',59000,'published'),
 ('AV-P02','novelys','appareils-a-panini','grill-inox','AV-P02','Grill Inox','Un gril de comptoir en finition inox.','/images/kitchen/grill.webp',69000,'published')
ON CONFLICT DO NOTHING;
COMMIT;
