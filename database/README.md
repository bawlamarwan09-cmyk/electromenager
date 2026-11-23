# Catalogue Aura Volt

La migration cible PostgreSQL. Exécuter une fois sur une base de développement vide avec un compte autorisé à créer des tables.

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/001_catalogue.sql
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f database/demo.sql
```

Le deuxième fichier est facultatif. Il reprend les références fictives du site pour tester le futur dashboard. Les identifiants sont stables et distincts des slugs éditables. Le statut publié dans ces fixtures signifie visible dans le catalogue de démonstration. Le site statique lit encore les données TypeScript.

Une famille dépend d’un univers. Chaque produit possède une marque, une famille, une référence unique et une liste ordonnée de caractéristiques. Le tarif est enregistré en centimes de dirham. Une valeur NULL permet de gérer un prix sur demande. Les marques proposées par un filtre se déduisent des produits publiés de la famille.

Une comparaison est facultative. Enregistrer la paire dans l’ordre croissant des identifiants. Les clés étrangères imposent une famille commune et autorisent deux marques différentes. Archiver un produit via son statut conserve ses relations.
