-- Existing demonstration guides and their catalogue links.

BEGIN;

INSERT INTO article (id, slug, title, topic, introduction, image_key, status) VALUES
    ('choisir-capacite-lave-linge', 'choisir-capacite-lave-linge', 'Quelle capacité choisir pour votre lave-linge ?', 'Lavage', 'Le bon point de départ, c’est votre quotidien : le nombre de personnes, la fréquence des lessives et les textiles à laver.', 'washer', 'published'),
    ('choisir-refrigerateur', 'choisir-refrigerateur', 'Le réfrigérateur adapté à votre quotidien.', 'Froid', 'Avant de choisir une finition, prenez le temps de regarder votre espace, vos habitudes et les contraintes de votre cuisine.', 'fridge', 'published'),
    ('choisir-chauffe-eau', 'choisir-chauffe-eau', 'Choisir un chauffe-eau', 'Chauffe-eau', 'Décrivez vos besoins en eau chaude sur une journée habituelle.', 'chauffe-eau', 'published'),
    ('aspirateur-avec-ou-sans-fil', 'aspirateur-avec-ou-sans-fil', 'Aspirateur avec ou sans fil ?', 'Aspirateurs', 'Partez du trajet à nettoyer et du type de sol.', 'washer', 'published'),
    ('dimensions-four-encastrable', 'dimensions-four-encastrable', 'Que mesurer avant d’acheter un four encastrable ?', 'Fours', 'Relevez les mesures intérieures du meuble.', 'washer', 'published'),
    ('choisir-fournisseur-electromenager', 'choisir-fournisseur-electromenager', 'Choisir un fournisseur pour votre magasin', 'Revendeurs', 'Comparez deux propositions sur un panier identique.', 'washer', 'published'),
    ('preparer-devis-projet-immobilier', 'preparer-devis-projet-immobilier', 'Préparer un devis pour un programme immobilier', 'Immobilier', 'Préparez un tableau par typologie de logement pour obtenir des devis comparables.', 'washer', 'published'),
    ('equipement-chambres-hotel', 'equipement-chambres-hotel', 'Préparer l’équipement des chambres d’hôtel ou de riad', 'Hôtellerie', 'Distinguez les équipements des chambres de ceux des espaces communs.', 'washer', 'published');

INSERT INTO article_section (article_id, position, heading, body) VALUES
    ('choisir-capacite-lave-linge', 0, 'Partez de vos habitudes', 'Si vous faites des petites lessives fréquentes, un grand tambour n’est pas forcément utile. À l’inverse, les draps et les grandes pièces peuvent demander plus de volume.'),
    ('choisir-capacite-lave-linge', 1, 'Distinguez capacité et encombrement', 'La capacité en kilogrammes ne renseigne pas sur les dimensions extérieures. Mesurez la largeur, la profondeur, les passages et l’espace nécessaire pour ouvrir le hublot.'),
    ('choisir-capacite-lave-linge', 2, 'Comparez les références réelles', 'Vérifiez les programmes, l’essorage, le niveau sonore et la consommation indiqués par le fabricant. Demandez la fiche technique avant de valider votre choix.'),
    ('choisir-refrigerateur', 0, 'Mesurez l’espace disponible', 'Relevez la largeur, la hauteur et la profondeur de l’emplacement. Conservez les dégagements de ventilation demandés dans la notice du fabricant.'),
    ('choisir-refrigerateur', 1, 'Regardez au-delà du volume', 'La répartition entre réfrigération et congélation, les rangements et le sens d’ouverture des portes comptent autant que le volume total.'),
    ('choisir-refrigerateur', 2, 'Préparez la livraison', 'Vérifiez les portes, les couloirs, les escaliers et l’ascenseur. Confirmez les conditions de livraison et de mise en place avant la commande.'),
    ('choisir-chauffe-eau', 0, 'À quelles heures utilisez-vous l’eau chaude ?', 'Notez les douches successives, les points de puisage et les périodes de forte demande. Ces informations aident le fournisseur à dimensionner l’appareil.'),
    ('choisir-chauffe-eau', 1, 'Que vérifier avant commande ?', 'Demandez à un installateur de vérifier l’emplacement, les raccordements et les prescriptions du fabricant pour le modèle envisagé.'),
    ('aspirateur-avec-ou-sans-fil', 0, 'Pour une longue séance', 'Un appareil filaire évite les pauses de recharge. Vérifiez le rayon d’action et les prises disponibles.'),
    ('aspirateur-avec-ou-sans-fil', 1, 'Pour des passages fréquents', 'Comparez le poids avec la brosse montée, l’autonomie dans le mode utilisé et la facilité de vider le bac.'),
    ('dimensions-four-encastrable', 0, 'Mesurer la niche', 'Notez largeur, profondeur et hauteur utiles. La largeur de façade seule ne suffit pas pour choisir le four.'),
    ('dimensions-four-encastrable', 1, 'Vérifier la pose', 'Comparez ces mesures au plan de pose et vérifiez la ventilation, le passage des câbles et le débattement de la porte avec le poseur.'),
    ('choisir-fournisseur-electromenager', 0, 'Comparer les offres', 'Demandez les références exactes, les quantités disponibles, le prix par lot et la possibilité de mélanger les familles.'),
    ('choisir-fournisseur-electromenager', 1, 'Préparer le réassort', 'Faites préciser le minimum de commande, le délai de livraison, le traitement des produits endommagés et les conditions de garantie.'),
    ('preparer-devis-projet-immobilier', 0, 'Construire les lots', 'Indiquez le nombre de logements par type, les appareils de chaque cuisine, les dimensions des niches et les plans disponibles. Multipliez les quantités par typologie.'),
    ('preparer-devis-projet-immobilier', 1, 'Organiser les phases', 'Indiquez les dates de réception par bâtiment, les accès au chantier et les prestations de pose souhaitées. Demandez un chiffrage séparé par phase.'),
    ('equipement-chambres-hotel', 0, 'Décrire chaque chambre type', 'Indiquez le nombre de chambres, les dimensions des kitchenettes, les usages et les contraintes acoustiques. Demandez le niveau sonore documenté pour chaque référence.'),
    ('equipement-chambres-hotel', 1, 'Vérifier les conditions professionnelles', 'Faites confirmer par écrit la garantie pour l’usage prévu, le calendrier de livraison et la prise en charge en cas de panne.');

INSERT INTO article_category (article_id, category_id) VALUES
    ('choisir-capacite-lave-linge', 'machines-a-laver'),
    ('choisir-refrigerateur', 'refrigerateurs'),
    ('preparer-devis-projet-immobilier', 'lave-vaisselle'),
    ('choisir-chauffe-eau', 'chauffe-eau'),
    ('preparer-devis-projet-immobilier', 'plaques-de-cuisson'),
    ('choisir-refrigerateur', 'congelateurs'),
    ('aspirateur-avec-ou-sans-fil', 'aspirateurs'),
    ('dimensions-four-encastrable', 'fours'),
    ('preparer-devis-projet-immobilier', 'hottes');

INSERT INTO article_product (article_id, product_id) VALUES
    ('choisir-capacite-lave-linge', 'AV-L800'),
    ('choisir-capacite-lave-linge', 'AV-L1000'),
    ('choisir-refrigerateur', 'AV-F420'),
    ('choisir-refrigerateur', 'AV-F280'),
    ('choisir-chauffe-eau', 'AV-D03'),
    ('aspirateur-avec-ou-sans-fil', 'AV-A200'),
    ('aspirateur-avec-ou-sans-fil', 'AV-A160'),
    ('dimensions-four-encastrable', 'AV-C650'),
    ('dimensions-four-encastrable', 'AV-C720'),
    ('preparer-devis-projet-immobilier', 'AV-D02'),
    ('preparer-devis-projet-immobilier', 'AV-D04');

COMMIT;

