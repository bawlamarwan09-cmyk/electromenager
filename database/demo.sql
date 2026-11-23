-- Optional demo fixtures. Apply once to an empty catalogue.

BEGIN;

INSERT INTO catalogue_universe (id, slug, name) VALUES
    ('gros', 'gros', 'Gros électroménager'),
    ('petit', 'petit', 'Petit électroménager');

INSERT INTO brand (id, slug, name) VALUES
    ('alvoria', 'alvoria', 'Alvoria'),
    ('novelys', 'novelys', 'Novélys');

INSERT INTO category (id, universe_id, slug, name, advice, guide_slug) VALUES
    ('machines-a-laver', 'gros', 'machines-a-laver', 'Lave-linge', 'Comparez la charge de linge sec, la profondeur avec hublot et la place nécessaire pour ouvrir la porte.', 'choisir-capacite-lave-linge'),
    ('refrigerateurs', 'gros', 'refrigerateurs', 'Réfrigérateurs', 'Mesurez la niche, les passages et le débattement des portes. Comparez les volumes utiles du froid et du congélateur séparément.', 'choisir-refrigerateur'),
    ('lave-vaisselle', 'gros', 'lave-vaisselle', 'Lave-vaisselle', 'Comparez le nombre de couverts, la largeur de niche et la hauteur sous plan. Vérifiez les raccordements avec votre installateur.', 'preparer-devis-projet-immobilier'),
    ('chauffe-eau', 'gros', 'chauffe-eau', 'Chauffe-eau', 'Précisez le nombre de points d’eau et les usages simultanés. Faites confirmer la capacité et la compatibilité avec votre installation.', 'choisir-chauffe-eau'),
    ('plaques-de-cuisson', 'gros', 'plaques-de-cuisson', 'Plaques de cuisson', 'Relevez la découpe du plan de travail, le type d’alimentation et le nombre de foyers souhaité.', 'preparer-devis-projet-immobilier'),
    ('congelateurs', 'gros', 'congelateurs', 'Congélateurs', 'Un coffre demande un dégagement au-dessus, une armoire un débattement devant. Comparez les dimensions et le volume utile.', 'choisir-refrigerateur'),
    ('aspirateurs', 'petit', 'aspirateurs', 'Aspirateurs', 'Comparez le poids en main, le rayon d’action, les accessoires pour vos sols et la capacité du bac.', 'aspirateur-avec-ou-sans-fil'),
    ('fours', 'gros', 'fours', 'Fours', 'Mesurez la niche et consultez le schéma d’encastrement du modèle. Comparez le volume utile et les modes de cuisson.', 'dimensions-four-encastrable'),
    ('hottes', 'gros', 'hottes', 'Hottes', 'Vérifiez la largeur du plan de cuisson, la possibilité d’évacuation et les filtres prévus pour un montage en recyclage.', 'preparer-devis-projet-immobilier');

INSERT INTO product (id, brand_id, category_id, slug, sku, name, description, image_key, price_centimes, status) VALUES
    ('AV-F420', 'alvoria', 'refrigerateurs', 'refrigerateur-horizon-420', 'AV-F420', 'Réfrigérateur Horizon 420', 'Un grand volume, des lignes épurées et une finition inox pour imaginer votre cuisine.', 'fridge', 649000, 'published'),
    ('AV-L800', 'novelys', 'machines-a-laver', 'lave-linge-pure-8', 'AV-L800', 'Lave-linge Pure 8', 'Un lave-linge à hublot pensé pour les besoins du quotidien, dans une finition intemporelle.', 'washer', 379000, 'published'),
    ('AV-C650', 'alvoria', 'fours', 'four-essential-65', 'AV-C650', 'Four Essential 65', 'Un four encastrable au design sobre, pour une cuisine harmonieuse et fonctionnelle.', 'oven', 299000, 'published'),
    ('AV-A200', 'novelys', 'aspirateurs', 'aspirateur-compact-2000', 'AV-A200', 'Aspirateur Compact 2000', 'Un format compact et pratique pour accompagner l’entretien de votre intérieur.', 'vacuum', 89000, 'published'),
    ('AV-F280', 'novelys', 'refrigerateurs', 'refrigerateur-city-280', 'AV-F280', 'Réfrigérateur City 280', 'Un format polyvalent pour les cuisines et les espaces de vie plus compacts.', 'fridge', 429000, 'published'),
    ('AV-L1000', 'alvoria', 'machines-a-laver', 'lave-linge-family-10', 'AV-L1000', 'Lave-linge Family 10', 'Une grande capacité illustrative pour comparer les équipements de la gamme lavage.', 'washer', 499000, 'published'),
    ('AV-C720', 'novelys', 'fours', 'four-studio-72', 'AV-C720', 'Four Studio 72', 'Un équipement encastrable pour imaginer une cuisine de résidence ou de logement.', 'oven', 369000, 'published'),
    ('AV-A160', 'alvoria', 'aspirateurs', 'aspirateur-silent-1600', 'AV-A160', 'Aspirateur Silent 1600', 'Un modèle de démonstration pour explorer notre sélection entretien de la maison.', 'vacuum', 119000, 'published'),
    ('AV-D02', 'novelys', 'lave-vaisselle', 'lave-vaisselle-source-12', 'AV-D02', 'Lave-vaisselle Source 12', 'Comparez le nombre de couverts, la largeur de niche et la hauteur sous plan. Vérifiez les raccordements avec votre installateur.', 'lave-vaisselle', 329000, 'published'),
    ('AV-D03', 'alvoria', 'chauffe-eau', 'chauffe-eau-rive-50', 'AV-D03', 'Chauffe-eau Rive 50', 'Précisez le nombre de points d’eau et les usages simultanés. Faites confirmer la capacité et la compatibilité avec votre installation.', 'chauffe-eau', 149000, 'published'),
    ('AV-D04', 'novelys', 'plaques-de-cuisson', 'plaque-sillage-60', 'AV-D04', 'Plaque Sillage 60', 'Relevez la découpe du plan de travail, le type d’alimentation et le nombre de foyers souhaité.', 'plaques-de-cuisson', 229000, 'published'),
    ('AV-D05', 'alvoria', 'congelateurs', 'congelateur-polaire-180', 'AV-D05', 'Congélateur Polaire 180', 'Un coffre demande un dégagement au-dessus, une armoire un débattement devant. Comparez les dimensions et le volume utile.', 'congelateurs', 349000, 'published'),
    ('AV-D08', 'novelys', 'hottes', 'hotte-brise-60', 'AV-D08', 'Hotte Brise 60', 'Vérifiez la largeur du plan de cuisson, la possibilité d’évacuation et les filtres prévus pour un montage en recyclage.', 'hottes', 129000, 'published');

INSERT INTO product_specification (product_id, label, value, display_order) VALUES
    ('AV-F420', 'Capacité illustrative', '420 L', 0),
    ('AV-F420', 'Dimensions illustratives', '70 × 68 × 185 cm', 1),
    ('AV-F420', 'Finition', 'Inox brossé', 2),
    ('AV-L800', 'Capacité illustrative', '8 kg', 0),
    ('AV-L800', 'Essorage illustratif', '1 200 tr/min', 1),
    ('AV-L800', 'Finition', 'Argent', 2),
    ('AV-C650', 'Volume illustratif', '65 L', 0),
    ('AV-C650', 'Largeur illustrative', '60 cm', 1),
    ('AV-C650', 'Finition', 'Noir et inox', 2),
    ('AV-A200', 'Puissance illustrative', '2 000 W', 0),
    ('AV-A200', 'Capacité illustrative', '2 L', 1),
    ('AV-A200', 'Finition', 'Noir graphite', 2),
    ('AV-F280', 'Capacité illustrative', '280 L', 0),
    ('AV-F280', 'Finition', 'Inox', 1),
    ('AV-L1000', 'Capacité illustrative', '10 kg', 0),
    ('AV-L1000', 'Essorage illustratif', '1 400 tr/min', 1),
    ('AV-C720', 'Volume illustratif', '72 L', 0),
    ('AV-C720', 'Largeur illustrative', '60 cm', 1),
    ('AV-A160', 'Puissance illustrative', '1 600 W', 0),
    ('AV-A160', 'Capacité illustrative', '3 L', 1),
    ('AV-D02', 'Capacité', '12 couverts', 0),
    ('AV-D03', 'Volume', '50 L', 0),
    ('AV-D04', 'Largeur', '60 cm', 0),
    ('AV-D05', 'Volume', '180 L', 0),
    ('AV-D08', 'Largeur', '60 cm', 0);

INSERT INTO product_comparison (category_id, product_a_id, product_b_id) VALUES
    ('machines-a-laver', 'AV-L1000', 'AV-L800'),
    ('refrigerateurs', 'AV-F280', 'AV-F420'),
    ('aspirateurs', 'AV-A160', 'AV-A200'),
    ('fours', 'AV-C650', 'AV-C720');

COMMIT;

