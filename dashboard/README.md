# Administration du catalogue

Avec Python 3.11+ sur une machine locale, initialiser une base de démonstration et créer le premier compte personnel :

```sh
python dashboard/manage.py init --demo
python dashboard/manage.py create-admin
python dashboard/manage.py serve
```

Ouvrir http://127.0.0.1:8100 dans le navigateur. SQLite enregistre les données dans le dossier personnel, sous .aura-volt/catalogue.sqlite. DASHBOARD_DB permet de choisir le fichier. Réserver init aux bases vides.

Pour PostgreSQL, installer psycopg 3 avec `python -m pip install "psycopg[binary]>=3.2,<4"` et configurer DATABASE_URL. Sur une base déjà migrée avec 001 et 002, appliquer seulement database/003_dashboard.sql avant de créer le compte. Pour un hébergement, placer le service local derrière un reverse proxy HTTPS et configurer DASHBOARD_ORIGIN avec l’origine publique exacte. Le site vitrine statique utilise encore ses fixtures TypeScript.

Les formulaires couvrent les données du catalogue, le contenu éditorial et leurs associations. La suppression demande confirmation. Pour retirer un produit de la publication tout en conservant les relations, utiliser son statut archivé.

Le suivi de stock désactivé correspond à une disponibilité à confirmer. Avec le suivi activé, une quantité nulle indique une rupture. Les promotions portent sur les références sélectionnées et s’appliquent pendant leurs dates inclusives. La vue catalogue_offer renvoie le meilleur pourcentage applicable et le montant final en centimes. Les comptes se créent en ligne de commande. Désactiver dashboard_user.active révoque l’accès, y compris pour les sessions existantes.

## Import des photos reçues le 26 novembre 2026

Sur une base déjà initialisée, lancer une fois `python3 dashboard/manage.py import-photos`, puis démarrer le dashboard. La commande crée la galerie et ajoute les fiches en brouillon. Une seconde exécution conserve les modifications manuelles et évite les doublons techniques.

Le lot contient 189 fiches candidates et 199 photos de produits, réparties sur 25 familles. Dix photos ont été rapprochées de vues déjà présentes. Les fichiers identiques ont été dédupliqués avant préparation. Quatre logos, une vue de stock et un carton non identifiable figurent dans l’inventaire avec un motif d’exclusion.

Les références constructeur et les correspondances entre variantes restent à vérifier. Les affiches montrant plusieurs tailles ou modèles restent une fiche candidate à diviser après vérification. Le code REAL-xxx est un identifiant interne du lot. Prix, stock et garantie sont à renseigner avant publication. Le manifeste database/imports/photos-2026-11-26.json conserve les noms des fichiers d’origine, les empreintes et les rapprochements. Les photos se consultent directement dans la fiche produit du dashboard.

Pour afficher ce lot sur le site local, lancer `python3 dashboard/manage.py publish-photos`. Les fiches encore en brouillon du lot sont publiées avec prix sur demande. Les fiches archivées conservent leur statut. Le catalogue public privilégie les références réelles dès qu’une référence du lot est publiée.

### Photos produit trouvées par référence

Les photographies originales servent à identifier les produits. Les nouvelles photos du catalogue sont téléchargées depuis une fiche correspondant au même modèle et validées dans `database/imports/product-image-sourcing-review.json`. Seules les entrées `accepted_images` sont importées : fichiers transparents relus face aux références, sources et empreinte SHA-256 conservées. Le détourage et la correction d’éclairage sont désormais autorisés. Les modèles, couleurs et détails visibles doivent être conservés ; aucune nouvelle vue cachée ne doit être inventée. Les prises de vue partielles ou ambiguës restent en attente.

Après récupération des changements :

```bash
python3 dashboard/manage.py refine-photos
```

Cette commande applique les faits contrôlés et les photos approuvées. Elle conserve les modifications manuelles des noms, descriptions, marques, catégories et images. Le nombre de vues encore manquantes est indiqué dans le fichier de suivi. Une seule photo trouvée ne devient pas artificiellement trois vues. Les photos d'origine restent disponibles comme justificatifs dans les sources, mais quittent la galerie publique lorsqu'un nouveau visuel est approuvé.
