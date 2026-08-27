# Freeman LTD - Site Vitrine Officiel

## 🚀 Aperçu du Projet

Site vitrine institutionnel pour Freeman LTD, une agence digitale spécialisée dans le développement full stack, l'IA et le growth marketing.

**Tagline:** BUILD · LAUNCH · SCALE

## ✨ Fonctionnalités Implémentées

### Pages
- **HomePage** - Page principale one-page avec toutes les sections
- **SaaS Detail Pages** - Pages dédiées pour chaque projet SaaS (/saas/:slug)
- **Formation Detail Pages** - Pages dédiées pour chaque formation (/formations/:slug)

### Sections de la Page Principale

1. **Navigation**
   - Menu fixe avec effet glassmorphism
   - Scroll smooth vers les sections
   - Indicateur de disponibilité animé
   - Menu hamburger responsive

2. **Hero Section**
   - Scène 3D interactive (React Three Fiber)
   - Grille spatiale animée
   - Parallaxe au mouvement de la souris
   - Métriques flottantes (ROAS, SaaS livrés, etc.)
   - Animation séquentielle du tagline

3. **SaaS Section**
   - 6 projets SaaS avec données réelles
   - Cards 3D avec effet flip au hover
   - Filtres par verticale (IA/LLM, Niche Métier, Productivité Dev)
   - Badges de statut (En production, Beta, Stealth)
   - Navigation vers pages détaillées

4. **Projects Section**
   - 5 projets freelance sélectionnés
   - Présentation avec résultats mesurables
   - Stack technique visible
   - Cards avec effet hover

5. **Formations Section**
   - 6 formations complètes
   - Double filtrage : Niveau + Thème
   - Métriques (étudiants, note moyenne)
   - Prix et informations détaillées
   - Navigation vers pages de checkout

6. **Services Section**
   - 4 offres de service avec tarifs
   - Processus en 4 étapes visualisé
   - Cards avec effet glassmorphism

7. **Team Section**
   - Présentation des 2 associés
   - Témoignages clients (2) et apprenants (2)
   - Technologies maîtrisées (12 badges)

8. **Contact Section**
   - Formulaire de contact fonctionnel (React Hook Form)
   - Validation frontend
   - Lien Calendly pour appels découverte
   - Réseaux sociaux (LinkedIn, GitHub, Twitter)
   - Localisation (Marseille)

## 🎨 Design System

### Palette de Couleurs
- **Space Black:** #06080F (Fond principal)
- **Deep Navy:** #0A1628 (Fond secondaire)
- **Electric Blue:** #185FA5 (Primaire)
- **Deep Teal:** #0F6E56 (Secondaire)
- **Deep Purple:** #3C3489 (Tertiaire)
- **Off-white:** #E8F2FB (Texte principal)
- **Muted Blue-Gray:** #6B7A99 (Texte secondaire)

### Typographie
- **Titres:** JetBrains Mono (900/700/600)
- **Corps:** Inter (400/500/600)
- **Code/Tech:** JetBrains Mono

### Effets Visuels
- Glassmorphism (backdrop-blur + borders transparents)
- Grille de fond (pattern 44×44px)
- Particules 3D et étoiles animées
- Hover effects avec transitions
- Animations Motion (Framer Motion)

## 🛠️ Stack Technique

- **Framework:** React avec Vite
- **Routing:** React Router 7 (Data mode)
- **3D:** React Three Fiber + Drei + Three.js
- **Animations:** Motion (Framer Motion)
- **Styling:** Tailwind CSS v4
- **Forms:** React Hook Form
- **UI:** Radix UI components + shadcn/ui
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📦 Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── ContactSection.tsx
│   │   ├── FormationsSection.tsx
│   │   ├── HeroScene3D.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── SaasSection.tsx
│   │   ├── ServicesSection.tsx
│   │   └── TeamSection.tsx
│   ├── data/
│   │   ├── formations.ts
│   │   └── saas.ts
│   ├── pages/
│   │   ├── FormationDetailPage.tsx
│   │   ├── HomePage.tsx
│   │   └── SaasDetailPage.tsx
│   ├── App.tsx
│   └── routes.tsx
└── styles/
    ├── fonts.css
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## 🎯 Fonctionnalités Clés

### Interactivité
- ✅ Scroll smooth avec ancres
- ✅ Navigation clavier accessible
- ✅ Cards flip 3D au hover
- ✅ Filtres dynamiques (client-side)
- ✅ Formulaire avec validation
- ✅ Animations au scroll (viewport detection)
- ✅ Responsive mobile-first

### 3D & Animations
- ✅ Scène 3D avec React Three Fiber
- ✅ Champ de particules animé
- ✅ Grille perspective en mouvement
- ✅ Parallaxe souris
- ✅ Animations séquentielles
- ✅ Hover effects avancés

### Performance
- ✅ Lazy loading des images
- ✅ Optimisation bundle
- ✅ CSS optimisé avec Tailwind
- ✅ Animations GPU-accelerated

## 📱 Responsive Design

- **Desktop:** Layout complet avec toutes les animations
- **Tablet:** Layout adapté, 3D maintenu
- **Mobile:** Menu hamburger, 3D allégé, scroll optimisé

## 🔄 Données

### SaaS Projects (6)
1. AI Content Optimizer (IA/LLM)
2. DevFlow Manager (Productivité Dev)
3. MediConnect (Niche Métier)
4. SmartInvoice AI (IA/LLM)
5. Datalytics Pro (Productivité Dev)
6. LegalTech Suite (Niche Métier)

### Formations (6)
1. Développeur Full Stack Moderne (Web, Intermédiaire)
2. IA Pratique (IA, Débutant)
3. Lancer un SaaS Rentable (SaaS, Intermédiaire)
4. Growth Marketing Avancé (Growth, Avancé)
5. Mobile React Native (Web, Intermédiaire)
6. TypeScript Avancé (Web, Avancé)

## 🚦 Prochaines Étapes

### Contenu à Produire
- [ ] Photos professionnelles des associés
- [ ] Screenshots réels des SaaS
- [ ] Vidéos démo des SaaS
- [ ] Extraits de formations
- [ ] Logos clients (avec accords)

### Intégrations à Configurer
- [ ] Lemon Squeezy / Gumroad (checkout formations)
- [ ] Resend / Nodemailer (emails contact)
- [ ] Calendly (appels découverte)
- [ ] Google Analytics / Vercel Analytics
- [ ] Sentry (monitoring erreurs)

### Déploiement
- [ ] Configurer domaine (freeman-ltd.com)
- [ ] Déployer sur Vercel
- [ ] Configurer SSL
- [ ] Tester performances (Lighthouse)
- [ ] SEO (meta tags, sitemap, robots.txt)

## 📄 Pages Légales à Créer
- [ ] Mentions légales
- [ ] Politique de confidentialité (RGPD)
- [ ] CGV (Conditions Générales de Vente)

## 🎨 Améliorations Futures (Nice-to-have)

- [ ] Sphère 3D de compétences rotative
- [ ] Cursor personnalisé animé
- [ ] Blog / Ressources pour SEO
- [ ] Mode dégradé GPU (fallback 2D)
- [ ] Prévisualisation vidéo formations
- [ ] Lecteur vidéo pour démos SaaS
- [ ] Système de préférence système (déjà dark)

---

**Status:** ✅ Prêt pour validation et production de contenu
**Version:** 1.0
**Date:** Mars 2026
