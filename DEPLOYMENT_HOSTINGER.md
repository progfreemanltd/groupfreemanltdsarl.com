# 📋 FREEMAN - Déploiement sur Hostinger via GitHub

## ✅ ÉTAPE 1 : GITHUB - COMPLÉTÉE

**Repo:** `https://github.com/progfreemanltd/groupfreemanltdsarl.com`  
**Branche:** `main`  
**Commit:** `dc81a7f` - Security hardening (firestore.rules, .htaccess, .gitignore)  
**Status:** ✅ Synchronisé avec GitHub

---

## 📡 ÉTAPE 2 : CONFIGURATION HOSTINGER

### 2.1 Panel Hostinger - Section Git (cpanel)

1. **Accéder au panel**
   - Hostinger Dashboard → File Manager / Contenu du site
   - Ou directement : `https://hpanel.hostinger.com` → Gestion du domaine

2. **Initialiser Git** (une seule fois)
   - Si répertoire vide : Uploader via cPanel File Manager
   - Ou utiliser Terminal SSH :
   ```bash
   ssh user@votre-domaine.com
   cd public_html
   git clone https://github.com/progfreemanltd/groupfreemanltdsarl.com .
   ```

3. **Vérifier la structure**
   ```bash
   ls -la
   # Doit montrer:
   # dist/           (fichiers compilés React)
   # public/         (assets + .htaccess)
   # src/            (source)
   # firestore.rules
   # package.json
   # vite.config.ts
   # .htaccess       (à la racine ou dans public/)
   ```

### 2.2 Configuration Hostinger - Domaine

1. **SSL/HTTPS**
   - Hpanel → Domaine → SSL Manager
   - Activer "AutoSSL" ou "Let's Encrypt Free"
   - Status: ✅ (forcé dans .htaccess)

2. **Document Root**
   - Hpanel → Domaine → Paramètres → Document Root
   - Définir: `/public_html/dist` (dossier build Vite)
   - OU `/public_html` si vous servez depuis public/

3. **Vérifier PHP Version**
   - Hpanel → Domaine → PHP Version
   - Mettre en 8.2+

---

## 🚀 ÉTAPE 3 : DÉPLOIEMENT INITIAL

### Option A : Clone + Build (Recommandé)

```bash
# SSH vers Hostinger
ssh user@your-domain.com

# Se placer dans public_html
cd public_html

# Clone repo
git clone https://github.com/progfreemanltd/groupfreemanltdsarl.com .

# Installer dépendances
npm install

# Compiler le projet
npm run build

# Vérifier le build
ls -la dist/
# Doit contenir: index.html, assets/, manifest.webmanifest, etc.
```

### Option B : Upload Direct (si pas d'accès npm)

```bash
# Sur votre machine local:
npm run build

# Upload dist/ entier via FTP/cPanel File Manager dans public_html/

# Puis via SSH:
cd public_html
cp dist/* .  # ou un alias pour servir depuis dist
```

---

## 🔄 ÉTAPE 4 : MISES À JOUR FUTURES (Git Pull)

### Via SSH (Recommandé)

```bash
cd public_html
git pull origin main
npm install --production
npm run build
```

### Via GitHub Actions (Webhook Auto-Deploy)

**Alternative:** Configurer Actions pour auto-déployer sur Hostinger

1. Créer: `.github/workflows/deploy-hostinger.yml`
```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build
        run: |
          npm install
          npm run build
      
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          script: |
            cd public_html
            git pull origin main
            npm install --production
            npm run build
```

2. Ajouter Secrets GitHub:
   - Settings → Secrets → Actions
   - Ajouter:
     - `HOSTINGER_HOST`: `your-domain.com`
     - `HOSTINGER_USER`: `cpanel-user`
     - `HOSTINGER_SSH_KEY`: Votre clé SSH privée

---

## ✅ VÉRIFICATION POST-DÉPLOIEMENT

### Checklist Hostinger

```bash
# 1. Vérifier les fichiers
cd public_html
ls -la dist/
# ✓ index.html présent
# ✓ assets/ folder avec CSS/JS compilés
# ✓ .htaccess dans public/ ou racine

# 2. Vérifier les permissions
chmod 755 dist/
chmod 755 public/
find dist -type f -exec chmod 644 {} \;

# 3. Tester le domaine
curl -I https://groupfreemanltdsarl.com
# Doit retourner 200 OK + en-têtes OWASP

# 4. Vérifier HTTPS
# ✓ Certificat SSL valide
# ✓ Redirection HTTP → HTTPS active

# 5. Vérifier .htaccess
# ✓ SPA routing fonctionnel (React Router)
# ✓ Compression GZIP active
# ✓ Cache busting actif pour assets
```

---

## 📊 STRUCTURE FINALE HOSTINGER

```
/public_html/
├── dist/                    (← Racine web Vite)
│   ├── index.html
│   ├── assets/             (JS/CSS compilés)
│   ├── manifest.webmanifest
│   └── sw.js               (Service Worker)
├── public/
│   └── .htaccess           (Sécurité + Routing)
├── src/                    (Source TypeScript/React)
├── firestore.rules         (Sécurité Firestore)
├── vite.config.ts
├── package.json
├── .htaccess               (Alternative: racine)
└── .git/                   (Repository)
```

---

## 🔐 SÉCURITÉ - VÉRIFICATION FINALE

**Éléments sécurité en place :**
- ✅ HTTPS forcé + HSTS activé
- ✅ Firestore Rules déployées (Super Admin only pour /admin_cms)
- ✅ CSP stricte configured
- ✅ Fichiers sensibles bloqués (.env, .git, package.json)
- ✅ Aucune clé API exposée côté client
- ✅ SPA Routing sécurisé

**Vérifier les en-têtes :**
```bash
curl -I https://groupfreemanltdsarl.com | grep -E "X-Frame-Options|X-Content-Type|Strict-Transport|Content-Security-Policy"

# Expected:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=31536000
# Content-Security-Policy: default-src 'self'...
```

---

## 📞 EN CAS DE PROBLÈME

| Problème | Solution |
|----------|----------|
| 404 sur routes React | Vérifier .htaccess présent + Mod Rewrite activé |
| HTTPS ne fonctionne pas | Hpanel → SSL Manager → Reissue AutoSSL |
| Fichiers CSS/JS ne chargent pas | Vérifier permissions (chmod 755 dist/) |
| Firestore non fonctionnel | Vérifier firestore.rules déployé + API keys correctes |
| Git pull échoue | Vérifier SSH key + permissions |

---

**Généré:** 2026-08-28 | **Status:** Prêt Production ✅
