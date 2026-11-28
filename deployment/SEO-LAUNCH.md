# Préparer le référencement public

Le preview est privé et non indexable. Ne pas retirer sa protection pour tenter de référencer une prévisualisation. Le site public doit utiliser son propre domaine HTTPS.

1. Configurer `SITE_URL` avec le domaine réel, sans chemin, puis `SEO_INDEXABLE=1` sur ce serveur. Le mode d’indexation refuse les domaines de preview ChatGPT. Reconstruire une fois avec les mêmes variables que le runtime.
2. Vérifier `robots.txt`, une canonical et le sitemap sur ce domaine. Le sitemap omet les alias canoniques, marques inconnues et fiches encore ambiguës. En mode serveur, le sitemap reflète le catalogue enregistré sans rebuild.
3. Confirmer les coordonnées, l’offre, les conditions commerciales et les références encore signalées dans `database/imports/seo-catalogue-review.json`. La correction SEO ne remplace pas une identification réelle. Les variantes ambiguës ne reçoivent pas un faux balisage Product.
4. Saisir le vrai jeton Search Console dans `GOOGLE_SITE_VERIFICATION`, valider la propriété dans le compte autorisé et envoyer `/sitemap.xml`. Aucun compte n’a été créé ou vérifié automatiquement.
5. Saisir le vrai identifiant GA4 `NEXT_PUBLIC_GA_ID`, reconstruire, accepter la mesure d’audience sur une session de test et vérifier la réception des événements dans GA4. Le script n’est pas chargé avant le choix du visiteur. Aucun identifiant fictif n’est utilisé.
6. Tester le domaine dans PageSpeed Insights et Search Console, sur mobile et desktop. Les contrôles HTML et build locaux ne sont pas un résultat Lighthouse ni une preuve d’indexation.

Les produits sans prix réel n’ont pas d’offre inventée. Le balisage descriptif Product seul ne garantit pas l’éligibilité à un résultat enrichi Google : les propriétés requises d’offre ou d’avis réels restent nécessaires. Aucune note, disponibilité, certification, adresse ou délai garanti n’est inventé.

Les villes ciblées sont réunies dans une page de préparation de livraison utile. Ne pas créer huit pages quasi identiques en remplaçant seulement le nom de la ville. Ajouter une page locale indépendante uniquement avec des informations locales réelles et distinctes.
