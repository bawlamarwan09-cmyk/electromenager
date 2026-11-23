# Aura Volt — Électroménager

## Structure actuelle

La version de revue couvre neuf familles, treize références fictives et huit guides, avec trois parcours professionnels, une demande de catalogue, disponibilité ou devis, et des pages séparées pour la livraison et la garantie. Les marque-pages de la première version restent utilisables. Les pages marques et réalisations sont conditionnées à la confirmation des marques vendues et à des projets documentés.

### Notes de la première version


Prototype responsive de la boutique Aura Volt, réalisé dans le dépôt `electromenager` avec Next.js 16, React 19 et TypeScript. Interface en français, identité issue du logo fourni, catalogue fictif et parcours B2B dédiés.

## Démarrage

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run typecheck
```

`npm run build` produit un export statique dans `out/`. Le site peut être déployé sur Vercel ou sur un hébergeur statique. `scripts/dev.mjs` traduit les options du runner de preview vers Next.js.

## Parcours inclus

- Accueil et catalogue de huit références fictives ; recherche, catégories et tri des prix.
- Fiches produits et sélection avec quantités conservée dans le navigateur.
- Pages professionnels : revendeurs, promoteurs, hôtels et riads.
- Formulaire de demande démo validé dans le navigateur ; téléchargement d’un récapitulatif texte, sans transmission de données.
- Deux guides, entreprise, livraison/SAV et page 404.
- Navigation mobile, liens internes, métadonnées spécifiques et HTML prérendu.

Les produits se modifient dans `lib/catalogue.ts`, les conseils dans `lib/advice.ts`, les couleurs dans `app/globals.css`. Les illustrations produit sont des SVG ; le showroom est un visuel généré pour cette maquette. Le logo est celui fourni par le client. Google Fonts est utilisé avec polices de repli.

## Démonstration, pas une boutique en production

Aucun paiement, compte client, envoi email ou WhatsApp et aucune base de données. Les prix, noms et caractéristiques sont fictifs. Les références ne constituent pas des offres commerciales. Le formulaire n’envoie rien ; les coordonnées saisies restent en mémoire jusqu’à fermeture de la page et dans le fichier téléchargé si l’utilisateur le demande. La sélection de références utilise localStorage.

L’indexation est volontairement bloquée (`noindex, nofollow` et `robots.txt`) tant que la maquette utilise des données fictives. Ne pas supprimer ces protections avant validation des données et des conditions. Ajouter le domaine canonique, sitemap et données structurées réelles lors du lancement ; aucune note, disponibilité ou offre structurée inventée.

## Avant lancement réel

Valider le catalogue, les photos et leurs droits, les prix, les coordonnées, l’histoire commerciale, les conditions de livraison/SAV, la politique de confidentialité et les mentions légales. Puis connecter le formulaire à une route serveur avec validation, protection antispam et limitation des abus. Utiliser Prisma/PostgreSQL seulement si un catalogue administrable ou des demandes persistantes sont effectivement retenus.

Voir `docs/structure.md` pour le brief, les sources et le plan des pages.
