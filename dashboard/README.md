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
