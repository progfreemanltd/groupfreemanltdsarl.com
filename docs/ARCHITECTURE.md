# Architecture cible — Freeman

## Objectif

Faire évoluer le site sans réécriture brutale : une application lisible, modulaire et facile à tester, avec des frontières de sécurité claires. L’architecture reste volontairement simple : **un frontend React/Vite**, **un backend Firebase pour les opérations de confiance** et **un dépôt unique**. Pas de microservices ni de duplication de logique entre Vercel et Firebase.

## Décision d’architecture

- **Vercel** : hébergement du frontend Vite, builds de prévisualisation et production depuis GitHub.
- **Firebase Auth** : identité et sessions.
- **Cloud Firestore** : données métier, avec règles strictes et testées.
- **Firebase Cloud Functions v2** : opérations privilégiées et métier sensibles (paiement, portefeuille, commandes, rôles, e-mails, webhooks vérifiés).
- **Firebase Storage** : fichiers, avec règles d’accès spécifiques si les dépôts de pièces/preuves sont activés.
- **Domaine/DNS** : ne basculer qu’après validation de la préproduction Vercel et des domaines autorisés Firebase.

Les clés privées ne vont jamais dans le bundle frontend ni dans une variable `VITE_*`. Les secrets backend sont gérés par Secret Manager/Firebase, séparément des variables publiques Vercel.

## Structure cible (migration progressive)

```text
.
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   └── decisions/                 # décisions courtes (ADR) lorsqu’un choix est important
├── public/
├── src/
│   ├── app/                       # démarrage, routeur, providers, layouts
│   ├── features/
│   │   ├── auth/
│   │   ├── corporate/
│   │   ├── marketplace/
│   │   ├── checkout/
│   │   ├── orders/
│   │   ├── messaging/
│   │   ├── cms/
│   │   └── content/               # blog, formations, SaaS, équipe
│   ├── shared/
│   │   ├── components/            # UI réutilisable sans logique métier
│   │   ├── hooks/
│   │   ├── lib/                   # formatage, dates, validation générique
│   │   └── types/
│   └── infrastructure/
│       └── firebase/              # initialisation client + adaptateurs SDK
├── functions/
│   └── src/
│       ├── modules/
│       │   ├── orders/
│       │   ├── payments/
│       │   ├── users/
│       │   └── contact/
│       ├── shared/                # validation, auth/roles, erreurs communes
│       └── index.ts               # exports des fonctions
├── tests/
│   ├── rules/                     # tests d’émulateur Firestore/Storage
│   └── e2e/                       # parcours utilisateur essentiels
├── firestore.rules
├── firestore.indexes.json
├── firebase.json
└── package.json
```

Cette structure est une **cible**, pas une invitation à déplacer tous les fichiers maintenant. Les pages et composants actuels restent en place pendant la préparation ; ils migrent par fonctionnalité, sans modifier l’interface en bloc. Les composants visuels génériques vont dans `shared`, les écrans et la logique propres à un domaine restent ensemble dans `features`.

## Règles de dépendance

1. `app` assemble les fonctionnalités et fournit routeur/providers ; il ne porte pas les règles métier.
2. Une fonctionnalité ne modifie pas directement les collections d’une autre fonctionnalité.
3. Les composants UI ne contiennent ni logique de paiement ni décisions d’autorisation.
4. Les appels Firestore côté client passent par des fonctions/adaptateurs nommés du domaine ; éviter les `collection(db, ...)` dispersés dans les pages.
5. Toute opération nécessitant confiance (argent, rôle, statut de commande, secrets, webhooks) est exécutée côté serveur.
6. Pas de couche ou d’abstraction ajoutée sans besoin réutilisé : la priorité est la clarté, pas le nombre de dossiers.

## Sécurité obligatoire dès le départ

### Identité et autorisations

- Le contrôle d’accès réel est fait par les règles Firestore/Storage et les fonctions backend, jamais par le fait qu’un bouton ou une route soit masqué dans React.
- Le navigateur ne peut pas attribuer/modifier les rôles privilégiés. La création d’un vendeur doit aboutir à un état `pending` défini côté serveur.
- Le client ne peut modifier que les champs de profil explicitement autorisés (par exemple nom et téléphone), jamais rôle, statut, solde ou indicateurs administratifs.
- Chaque collection utilisée par le code doit avoir des règles explicites et une matrice de permissions par rôle ; le refus par défaut est conservé.
- Les règles de mise à jour valident l’identité, les champs modifiables, les types, les tailles et les transitions d’état. Les données client ne sont pas une source fiable pour les montants ou les permissions.

### Paiements et commandes

- Supprimer les simulations de recharge et toute écriture client directe sur les soldes.
- Une fonction backend valide le paiement du prestataire, puis crée/met à jour commande et portefeuille de manière atomique (transaction Firestore), avec clé d’idempotence.
- Un webhook n’est accepté qu’après vérification de sa signature ; les montants, vendeurs et articles sont recalculés depuis des données fiables.
- Le vendeur ou l’acheteur ne peut pas s’auto-attribuer un statut final ni libérer les fonds.
- Tester explicitement les cas de rejeu, double clic, solde insuffisant, utilisateur non autorisé et webhook invalide.

### Données, secrets et anti-abus

- Valider les entrées aux frontières client et serveur (schémas typés, limites de longueur, formats et taille des fichiers).
- Stocker les secrets exclusivement côté fonctions dans Secret Manager ; ne jamais préfixer une clé secrète par `VITE_`.
- Activer Firebase App Check après tests sur les domaines de production/préproduction.
- Ajouter des limites de débit et protections anti-spam sur les fonctions publiques (contact/inscription), ainsi qu’un échappement HTML pour les courriels.
- Vérifier l’état Git avant tout déploiement : aucun `.env`, compte de service, export client ou secret ne doit être suivi.

### Tests de sécurité

- Tests automatisés des règles via Firebase Emulator : accès autorisé et refusé pour chaque rôle/collection.
- Tests unitaires des fonctions métier, notamment commandes et soldes.
- Tests end-to-end des parcours connexion, inscription, publication vendeur, contact et commande.
- Toute modification aux règles, rôles ou flux financiers doit être accompagnée de tests avant déploiement.

## État actuel et écarts constatés

L’application actuelle est une SPA React/Vite avec React Router, Firebase Auth/Firestore, une PWA et des dossiers `src/app/pages`, `components`, `context` et `data`. Une partie du code peut être conservée et déplacée graduellement.

Les écarts prioritaires révélés par l’audit :

1. Les règles Firestore ne correspondent pas à plusieurs parcours et collections utilisés (profils vendeurs, conversations, commandes, inscriptions/newsletter, etc.). Il faut inventorier les accès réels puis écrire les règles et tests ensemble ; ne pas ouvrir les règles globalement pour rétablir les écrans.
2. Les fonctions de commande modifient actuellement le portefeuille depuis le navigateur ; ce flux ne doit pas être activé en production avant sa migration serveur.
3. Les formulaires de contact affichent actuellement une confirmation simulée et ne délivrent pas de courriel.
4. L’API e-mail existante doit être sécurisée et raccordée au formulaire, ou remplacée par une fonction Firebase. Éviter d’exposer une clé Resend ou d’insérer du HTML non échappé.
5. Le workflow Hostinger est remplacé localement par une CI de build et de tests. Vercel est la cible d’hébergement web ; versionner `package-lock.json` et confirmer la CI avant de fusionner la branche de publication.
6. Les routes React en navigation directe et le service worker PWA doivent être testés sur le domaine de préproduction Vercel.

## Plan de mise en œuvre sans régression

### Étape 0 — Protéger l’état actuel

- Créer une branche de travail dédiée et sauvegarder/commiter les changements existants après revue par leur auteur. Le dépôt avait des modifications locales non commitées lors de la rédaction de ce plan ; ne pas les écraser ni lancer de refactor massif dessus.
- Choisir une seule source de vérité pour les dépendances : npm + `package-lock.json` versionné.
- Obtenir un build reproductible en local et dans GitHub Actions avant de toucher aux DNS.

### Étape 1 — Socle de déploiement

- Déployer la SPA sur une branche de prévisualisation Vercel depuis GitHub.
- Vérifier build, routes profondes, PWA/service worker, cache, variables publiques Firebase, logs et retour arrière.
- Autoriser le domaine de prévisualisation dans Firebase Auth si nécessaire ; garder Hostinger/DNS inchangés à ce stade.

### Étape 2 — Sécurité des données

- Dresser la liste des collections et opérations Firestore réellement appelées par chaque fonctionnalité.
- Définir une matrice rôle × opération et des schémas de documents.
- Corriger les règles avec tests Firebase Emulator, en donnant la priorité à `users`, `orders`, `products`, `conversations`, `messages`, `notifications` et `subscribers`.
- Publier les règles seulement après passage des tests de refus et d’autorisation.

### Étape 3 — Backend de confiance

- Mettre en place Firebase Functions v2 avec validation des entrées, vérification d’identité/rôle, secrets et journalisation minimale.
- Migrer d’abord contact/e-mail et opérations administratives, puis commandes et portefeuilles.
- N’activer aucun paiement réel avant les tests d’intégrité et d’idempotence et l’intégration vérifiée d’un prestataire.

### Étape 4 — Réorganisation par fonctionnalité

- Migrer un domaine à la fois (`auth`, `cms`, puis marketplace/messaging/checkout), sans changement fonctionnel simultané.
- Extraire d’abord les requêtes/mutations vers les modules de domaine ; déplacer ensuite pages et composants vers `features`.
- Supprimer l’ancien code seulement après comparaison visuelle et tests de parcours.

### Étape 5 — Bascule du domaine

- Critères requis : build CI vert, règles testées, formulaires fonctionnels, parcours critiques testés, PWA/routes validées, sauvegarde et procédure de rollback prêtes.
- Connecter le domaine personnalisé à Vercel, appliquer les seuls enregistrements DNS fournis par Vercel, vérifier HTTPS, puis surveiller erreurs et authentification.
- Le dépôt ne doit plus contenir d’action FTP vers Hostinger ; conserver Hostinger uniquement pour registrar/DNS et e-mail. Ne modifier les DNS du site qu’après validation de la production Vercel.

## Critères d’acceptation

- Un nouveau développeur peut installer les dépendances et lancer les tests avec des commandes documentées et reproductibles.
- Chaque fonctionnalité a une frontière lisible entre UI, logique métier et accès aux données.
- Une modification client ne permet pas de s’octroyer un rôle, un solde ou un état de commande.
- Les tests prouvent à la fois les accès autorisés et les accès interdits.
- Déployer une mise à jour ne nécessite ni intervention manuelle Hostinger ni modification directe en production.
