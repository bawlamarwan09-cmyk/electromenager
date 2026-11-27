# Catalogue synchronisé avec le dashboard

Le mode serveur Node/Python lit les mêmes données que le dashboard. Après « Enregistrer », la base est validée puis le catalogue public est écrit atomiquement. Une page ouverte récupère les modifications sous environ trois secondes. Les nouveaux produits publiés et les nouvelles catégories ont leurs propres URL sans reconstruction.

La prévisualisation ChatGPT reste un export statique. Elle ne peut pas lire une base SQLite sur un Mac. Pour le site public synchronisé, héberger le mode serveur sur le VPS avec Node et Python, puis diriger le domaine vers ce VPS.

## Préparer le serveur

1. Installer les dépendances avec `npm ci`.
2. Créer un répertoire persistant accessible au compte qui lance l’application, par exemple `/var/lib/aura-volt`.
3. Copier la base existante par un transfert privé, ou initialiser une nouvelle base et créer le compte administrateur avec les commandes de `dashboard/README.md`. Ne pas exécuter `init` sur une base existante.
4. Configurer les variables de `live.env.example` dans l’environnement du service. Elles doivent être identiques lors de la construction et du démarrage. Pour PostgreSQL, installer `psycopg` et renseigner `DATABASE_URL` à la place de SQLite.
5. Lancer `npm run build:server`, puis `npm run start:server` sous un gestionnaire de processus. La commande de démarrage lance les deux services locaux.
6. Adapter `nginx.conf.example` aux domaines réels et activer HTTPS avant l’ouverture publique. Le site écoute sur `127.0.0.1:3000` et le dashboard sur `127.0.0.1:8100` ; ne pas exposer directement ces ports.

Le sous-domaine du dashboard doit correspondre exactement à `DASHBOARD_ORIGIN`, y compris `https://`, pour que les formulaires passent le contrôle d’origine. `/dashboard/` sur le site redirige vers cet espace administrateur.

## Fonctionnement

- Le catalogue public contient uniquement les produits publiés ; les utilisateurs administrateurs et sessions ne sont jamais exportés.
- Les images s’ajoutent actuellement par URL ou chemin existant ; aucun téléversement n’est ajouté par cette synchronisation.
- Les articles publiés et leurs sections sont également synchronisés ; les brouillons restent privés.
- `npm run build` conserve l’export statique pour la prévisualisation existante.
- Une erreur de synchronisation après sauvegarde affiche une erreur ; ne pas ressaisir une nouvelle fiche sans vérifier si la base l’a déjà enregistrée.

Le port privé `DASHBOARD_PORT` et l’origine publique `DASHBOARD_ORIGIN` sont intégrés aux réécritures/redirections lors de `build:server`. Fournir les mêmes valeurs à la construction et au lancement. Les variables du processus (ou du gestionnaire de services) doivent être transmises à Node **et** Python ; le lanceur ne charge pas automatiquement `.env.production` pour Python.

Le lancement serveur refuse une base SQLite absente afin d’éviter de publier silencieusement un catalogue de démonstration. Initialiser le dashboard avant `start:server`. Le dossier parent de `STOREFRONT_PATH` est créé par l’exporteur. Après sauvegarde, un échec d’export renvoie une erreur explicite tout en indiquant que la modification a déjà été enregistrée dans la base.
