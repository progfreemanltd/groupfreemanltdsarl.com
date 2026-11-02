# Déploiement Freeman — Vercel, GitHub et Firebase

## Architecture retenue

- **GitHub** héberge le code et son historique.
- **Vercel** construit et héberge le frontend Vite. Les pull requests et branches de travail donnent une prévisualisation ; `main` est la branche de production.
- **Firebase** assure Auth, Firestore, Storage et, pour les opérations de confiance, les fonctions backend.
- **Hostinger** ne sert plus les fichiers du site et ne reçoit plus de déploiement FTP. Il reste registrar/gestionnaire DNS du domaine et fournisseur de messagerie si les boîtes y sont hébergées.

## Déploiement applicatif

Le projet Vercel `groupfreemanltdsarl-com` est déjà relié au dépôt GitHub. Paramètres attendus :

- Framework : Vite
- Build : `npm run build`
- Output : `dist`
- Root directory : `./`

Chaque push de branche produit une prévisualisation. Seul un merge approuvé vers `main` doit mettre à jour la production Vercel. Les règles Firestore ne sont pas déployées par Vercel : elles sont publiées séparément après les tests et une revue de sécurité.

## Domaine et messagerie

Ne basculer le domaine qu’après validation de l’URL de prévisualisation et de l’accès Firebase Auth.

1. Ajouter le domaine personnalisé dans les paramètres du projet Vercel.
2. Copier exactement les enregistrements DNS présentés par Vercel dans la zone DNS Hostinger.
3. Conserver les enregistrements de messagerie existants (MX et TXT/CNAME SPF, DKIM, DMARC) si Hostinger continue d’héberger les boîtes e-mail.
4. Ne pas changer les serveurs de noms, supprimer la zone DNS ou remplacer les MX pour connecter le site.
5. Attendre la validation DNS/HTTPS par Vercel, puis ajouter les domaines de production aux domaines autorisés de Firebase Authentication.
6. Tester la racine, les routes profondes, la connexion Firebase, le formulaire de contact et les e-mails avant de considérer la bascule terminée.

Les valeurs DNS précises ne doivent pas être recopiées depuis un guide générique : utiliser celles que Vercel affiche pour ce projet au moment de l’ajout du domaine.

## Vérifications avant production

- `npm ci`, `npm run build` et `npm run test:firestore-rules` passent dans CI.
- Vérifier l’URL de prévisualisation sur mobile et desktop ainsi qu’une route directe (ex. `/services`).
- Confirmer que les contenus CMS publics se chargent et qu’aucun réglage privé (webhook) n’est visible publiquement.
- Les fonctions financières (commandes, soldes, paiements) restent désactivées en production tant que les opérations de confiance ne sont pas migrées côté serveur et testées.
- Vérifier que le workflow GitHub ne téléverse plus vers Hostinger avant de merger sur `main`.
- Garder l’ancien hébergement accessible jusqu’à la validation DNS/HTTPS ; ne supprimer que les fichiers du site qui y sont publiés, jamais les données ou réglages de messagerie.

## Retour arrière

En cas de problème après une mise en production, promouvoir le déploiement précédent depuis Vercel. Les DNS ne doivent être modifiés qu’après la validation de la cible Vercel. Les règles Firebase nécessitent leur propre plan de retour arrière : conserver la version précédente revue et tester toute restauration avant publication.
