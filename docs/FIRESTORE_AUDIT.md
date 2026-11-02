# Firestore — parcours audités

Cible vérifiée : projet `groupfreemanltd`, base `(default)`, édition Standard / Native, région `nam5`. Les notes portent sur le code local ; la base distante n’a pas été modifiée.

## Écarts reproduits sur la préproduction

- `cms_content/homepage` et `cms_content/contact` sont lus par document depuis le navigateur, mais les règles publiques n’autorisent que les documents `published == true`. Les écritures CMS ne définissent pas ce champ : les lectures publiques sont donc refusées.
- `formations` est écoutée avec une requête de collection sans filtre. Les règles ne permettent pas cette requête à un visiteur anonyme puisqu’elles n’autorisent que les documents publiés.
- `cms_content/contact` mélange coordonnées publiques et réglages de webhook newsletter. Les règles Firestore protègent le document complet, pas ses champs individuellement : rendre le document public divulgue également ses réglages de webhook.

## Autres écarts importants, non corrigés par le correctif des lectures publiques

- `users`: création vendeurs et mises à jour client (profil/TVA/solde) non autorisées ou trop larges selon l’opération. Les soldes ne doivent pas être modifiables depuis le client.
- `products`: requête publique sans filtre `status`, création avec `pending_approval` face à la règle `pending`; l’autorisation des requêtes doit correspondre aux filtres Firestore.
- `orders`: schémas divergents (`buyerId`/`customerId`, `funds_locked`/`pending`) et opérations financières faites dans le navigateur. Les règles ne doivent pas être assouplies pour rétablir les paiements.
- `conversations` et `conversations/{id}/messages`, `notifications`, `subscribers`: accès client observés mais règles absentes ; refus par défaut.
- `formations`, `blog`, `team`, `saas`: vérifier les statuts de publication et les documents publics avant de considérer les listes comme sûres.

## Contraintes pour le correctif

- Conserver le refus par défaut.
- N’autoriser au public que des documents réellement publics, par identifiant explicite et/ou filtre `published == true`.
- Déplacer les intégrations privées hors des documents lus par les visiteurs.
- Garder rôles, soldes, commandes et transitions de paiement sous contrôle serveur.
- Tester succès **et refus** avec Firebase Emulator avant toute publication.

## Correctif local en préparation

- Lecture publique limitée aux documents `cms_content/homepage` et `cms_content/contact`; le contact est refusé au public si son document contient une clé hors liste publique, notamment une URL de webhook.
- Les réglages de webhook sont enregistrés dans `cms_private/contact_integrations`, super-admin uniquement. La prochaine sauvegarde de la fiche Contact depuis le CMS migre les anciennes valeurs vers ce document et remplace le document public par une version assainie.
- Les visiteurs lisent les formations avec `published == true`; les admins autorisés chargent aussi les brouillons.
- Tests d’émulateur ajoutés pour autorisations et refus. Ils ne peuvent pas encore s’exécuter sur cet environnement car Firebase Emulator requiert Java et `java` n’est pas installé/détecté. Le dry-run Firebase compile les règles, mais ne remplace pas ces tests comportementaux.
- Le webhook newsletter n’est pas appelé depuis le contexte public après séparation. Il devra être raccordé à une fonction serveur avec validation et limitation de débit ; aucun endpoint public d’écriture d’abonnés n’est ouvert en attendant.
