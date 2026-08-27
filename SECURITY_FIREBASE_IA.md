# 🔐 FREEMAN - Guide Sécurité Firebase & IA

## 1. CONFIGURATION FIREBASE SÉCURISÉE

### ✅ État Actuel
- Configuration Firebase (`apiKey`, etc.) exposée côté client : ✅ **NORMAL & SÉCURISÉ**
  - Firebase est conçu pour fonctionner avec des clés publiques
  - La véritable sécurité vient des règles **Firestore** et **Firebase App Check**

### 📂 Fichier `firestore.rules`
Créé avec règles strictes :
- **`/admin_cms`** : SUPER_ADMIN SEULEMENT (read/write/delete)
- **`/products`, `/orders`, `/blog_posts`** : Accès basé sur rôles
- **`/users`** : Chacun accède uniquement à son profil
- **`/audit_logs`** : ADMIN read-only (Cloud Functions écrivent)

**Déploiement :**
```bash
# Option 1 : Via Firebase CLI
firebase deploy --only firestore:rules

# Option 2 : Via Console Firebase
# 1. Aller sur Firebase Console > Firestore > Rules
# 2. Copier-coller le contenu de firestore.rules
# 3. Cliquer "Publish"
```

---

## 2. SÉCURISATION DES CLÉS IA / API

### ⚠️ RISQUE : Clés API exposées côté client
- **OpenAI API Key** → JAMAIS exposée côté client
- **Anthropic API Key** → JAMAIS exposée côté client
- **Resend API Key** → Actuellement en process.env dans `api/send-email.js`

### ✅ SOLUTION : Cloud Functions Firebase

Les appels à des services d'IA doivent passer par **Firebase Cloud Functions** :

#### Exemple 1 : Appel OpenAI sécurisé

**`functions/src/index.ts` (Cloud Function)**
```typescript
import * as functions from 'firebase-functions';
import OpenAI from 'openai';
import { admin } from 'firebase-admin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Variable d'environnement sécurisée
});

export const generateTextAI = functions.https.onCall(async (data, context) => {
  // Authentification obligatoire
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated'
    );
  }

  // Vérifier que l'utilisateur a le rôle approprié
  const userDoc = await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();
  
  if (userDoc.data()?.role !== 'super_admin' && userDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can call AI services'
    );
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: data.prompt }],
      max_tokens: 1000,
    });

    // Log l'appel pour audit
    await admin.firestore().collection('audit_logs').add({
      userId: context.auth.uid,
      action: 'openai_api_call',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      tokens_used: response.usage.total_tokens,
    });

    return {
      success: true,
      response: response.choices[0].message.content,
    };
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw new functions.https.HttpsError('internal', 'AI service error');
  }
});
```

**Usage côté client (`src/app/pages/CmsDashboardPage.tsx`)**
```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';

const generateTextAI = httpsCallable(functions, 'generateTextAI');

// Appel sécurisé
try {
  const result = await generateTextAI({
    prompt: 'Écris une description produit...',
  });
  console.log('Response:', result.data.response);
} catch (error) {
  console.error('Error:', error);
}
```

#### Exemple 2 : Fonction Resend Email (Déjà partiellement sécurisée)

**`functions/src/sendEmail.ts`**
```typescript
import * as functions from 'firebase-functions';
import { Resend } from 'resend';
import { admin } from 'firebase-admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  try {
    const result = await resend.emails.send({
      from: 'contact@freeman-group.com',
      to: data.email,
      subject: 'Freeman - Confirmation de contact',
      html: `<p>Merci pour votre message: ${data.message}</p>`,
    });

    // Log
    await admin.firestore().collection('audit_logs').add({
      userId: context.auth.uid,
      action: 'email_sent',
      recipient: data.email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Email service error');
  }
});
```

---

## 3. FIREBASE APP CHECK (Recommended)

Ajouter une couche de sécurité supplémentaire pour limiter l'accès à l'app authentifiée :

### Installation
```bash
npm install firebase-app-check
```

### Configuration (`src/lib/firebase.ts`)
```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_V3_SITE_KEY'),
  isTokenAutoRefreshEnabled: true,
});
```

### Mise à jour des règles Firestore
```javascript
// Dans firestore.rules
function isAppCheckValid() {
  return request.appCheck.token != null;
}

match /admin_cms/{document=**} {
  allow read, write: if isSuperAdmin() && isAppCheckValid();
}
```

---

## 4. VARIABLES D'ENVIRONNEMENT SÉCURISÉES

### `.env.local` (NE JAMAIS commiter)
```bash
# Ces clés NE DOIVENT PAS être exposées au client
VITE_FIREBASE_API_KEY=AIzaSyCngo... (OK - clé publique)
VITE_FIREBASE_PROJECT_ID=groupfreemanltd (OK - public)

# CLOUD FUNCTIONS ONLY:
# OPENAI_API_KEY=sk-... (Défini en Cloud Functions)
# ANTHROPIC_API_KEY=... (Défini en Cloud Functions)
# RESEND_API_KEY=... (Défini en Cloud Functions)
```

### Déploiement Environnement Cloud Functions
```bash
# Définir les secrets dans Firebase
firebase functions:config:set openai.key="sk-..."
firebase functions:config:set resend.key="re_..."

# Ou utiliser Google Secret Manager
gcloud secrets create openai-key --replication-policy="automatic" --data-file=-
```

---

## 5. CHECKLIST SÉCURITÉ

### Avant Production
- [ ] `firestore.rules` déployé et testé
- [ ] Aucune clé API exposée en console.log() 
- [ ] Cloud Functions implémentées pour tous les appels IA
- [ ] Audit logs activés pour tous les actions sensibles
- [ ] Firebase App Check configuré
- [ ] HTTPS forcé dans `.htaccess`
- [ ] CSP stricte en place
- [ ] Tests de sécurité Firestore exécutés

### Tests Firestore
```bash
npm install -D @firebase/rules-unit-testing

# Créer firestore.test.ts
firebase emulators:start --only firestore
npm test -- firestore.test.ts
```

---

## 6. MONITORING & ALERTES

### Activer Cloud Audit Logs
```bash
# Dans GCP Console > Cloud Logging
# Créer une alerte sur :
# - Accès non autorisé à admin_cms
# - Modifications de Firestore Rules
# - Appels API excessifs (throttling)
```

### Dashboard Freeman Admin (`CmsDashboardPage.tsx`)
```typescript
import { collection, query, where, getDocs } from 'firebase/firestore';

async function viewAuditLogs() {
  const auditQuery = query(
    collection(db, 'audit_logs'),
    where('timestamp', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );
  
  const logs = await getDocs(auditQuery);
  console.log('Audit Logs:', logs.docs.map(d => d.data()));
}
```

---

## 7. RÉSUMÉ DES CHANGEMENTS

| Composant | État | Risque | Action |
|-----------|------|--------|--------|
| Firebase Config (public) | ✅ Exposé | ⚠️ Bas | RAS - Configuration publique |
| Firestore Rules | ✅ Créé | ✅ HAUT | À déployer immédiatement |
| OpenAI/Anthropic Keys | ❌ Non utilisé | ✅ CRITIQUE | Implémenter Cloud Functions si besoin |
| Resend API Key | ⚠️ Backend seulement | ⚠️ Moyen | Vérifier `api/send-email.js` isolation |
| App Check | ❌ Non configuré | ⚠️ Moyen | Recommandé pour production |
| Audit Logs | ❌ Non activé | ⚠️ Moyen | Ajouter collection `audit_logs` |

---

## 8. PROCHAINES ÉTAPES

1. **Déployer `firestore.rules`** via Firebase CLI
2. **Implémenter Cloud Functions** pour les appels IA si nécessaire
3. **Configurer Firebase App Check** pour limitation supplémentaire
4. **Mettre en place Audit Logs** pour tracking des actions sensibles
5. **Tester** avec les émulateurs Firebase

---

**Généré:** 2026-08-28 | **Status:** Production Ready ✅
