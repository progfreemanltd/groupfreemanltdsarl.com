export interface SaasProject {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  vertical: 'IA / LLM' | 'Niche Métier' | 'Productivité Dev';
  status: 'En production' | 'Beta' | 'Stealth';
  stack: string[];
  logo: string;
  description: string;
  problem: string;
  solution: string;
  metrics: {
    users?: string;
    uptime?: string;
    performance?: string;
    revenue?: string;
  };
  demoUrl?: string;
  screenshots: string[];
}

export const saasProjects: SaasProject[] = [
  {
    id: '1',
    slug: 'ai-content-optimizer',
    title: 'AI Content Optimizer',
    tagline: 'Optimisez vos contenus avec l\'IA',
    vertical: 'IA / LLM',
    status: 'En production',
    stack: ['Next.js', 'OpenAI', 'Python', 'PostgreSQL'],
    logo: '🤖',
    description: 'Plateforme d\'optimisation de contenu alimentée par l\'IA pour améliorer le SEO et l\'engagement.',
    problem: 'Les créateurs de contenu passent des heures à optimiser manuellement leurs articles pour le SEO et l\'engagement.',
    solution: 'Notre IA analyse et améliore automatiquement vos contenus en temps réel, suggérant des optimisations SEO et des améliorations stylistiques.',
    metrics: {
      users: '2,500+ utilisateurs actifs',
      uptime: '99.9%',
      performance: '< 200ms temps de réponse',
      revenue: 'MRR en croissance de 45%'
    },
    demoUrl: '#',
    screenshots: []
  },
  {
    id: '2',
    slug: 'devflow-manager',
    title: 'DevFlow Manager',
    tagline: 'Gérez vos projets dev avec intelligence',
    vertical: 'Productivité Dev',
    status: 'En production',
    stack: ['React', 'Node.js', 'MongoDB', 'Docker'],
    logo: '⚡',
    description: 'Outil de gestion de projets spécialement conçu pour les équipes de développement.',
    problem: 'Les outils de gestion de projet traditionnels ne comprennent pas les workflows spécifiques du développement logiciel.',
    solution: 'DevFlow Manager s\'intègre avec GitHub, Jira et Slack pour automatiser la gestion de projet et le suivi du code.',
    metrics: {
      users: '800+ équipes',
      uptime: '99.95%',
      performance: 'Intégration en < 5 min'
    },
    demoUrl: '#',
    screenshots: []
  },
  {
    id: '3',
    slug: 'mediconnect',
    title: 'MediConnect',
    tagline: 'Connectez patients et praticiens',
    vertical: 'Niche Métier',
    status: 'Beta',
    stack: ['Vue.js', 'Laravel', 'MySQL', 'AWS'],
    logo: '🏥',
    description: 'Plateforme de télémédecine sécurisée pour les cabinets médicaux.',
    problem: 'Les cabinets médicaux ont besoin d\'une solution simple et sécurisée pour les consultations à distance.',
    solution: 'MediConnect offre des consultations vidéo cryptées, la gestion des dossiers patients et la prescription électronique.',
    metrics: {
      users: '150+ praticiens',
      uptime: '99.8%',
      performance: 'Certifié HDS'
    },
    demoUrl: '#',
    screenshots: []
  },
  {
    id: '4',
    slug: 'smartinvoice-ai',
    title: 'SmartInvoice AI',
    tagline: 'Facturation intelligente automatisée',
    vertical: 'IA / LLM',
    status: 'En production',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Stripe'],
    logo: '💼',
    description: 'Solution de facturation intelligente qui automatise la création et le suivi des factures.',
    problem: 'Les freelances et PME perdent du temps sur la facturation et les relances.',
    solution: 'L\'IA extrait automatiquement les données des emails et projets pour générer des factures conformes.',
    metrics: {
      users: '1,200+ entreprises',
      uptime: '99.9%',
      revenue: '€50k+ MRR'
    },
    demoUrl: '#',
    screenshots: []
  },
  {
    id: '5',
    slug: 'datalytics-pro',
    title: 'Datalytics Pro',
    tagline: 'Analytics avancés pour SaaS',
    vertical: 'Productivité Dev',
    status: 'Stealth',
    stack: ['React', 'Python', 'ClickHouse', 'Redis'],
    logo: '📊',
    description: 'Plateforme d\'analytics temps réel pour applications SaaS.',
    problem: 'Les solutions analytics classiques sont trop génériques pour les besoins spécifiques des SaaS.',
    solution: 'Datalytics Pro offre des métriques SaaS prêtes à l\'emploi (MRR, Churn, LTV) avec des tableaux de bord personnalisables.',
    metrics: {
      users: 'Bientôt disponible',
      performance: 'Analyse temps réel'
    },
    demoUrl: '#',
    screenshots: []
  },
  {
    id: '6',
    slug: 'legaltech-suite',
    title: 'LegalTech Suite',
    tagline: 'Automatisez votre juridique',
    vertical: 'Niche Métier',
    status: 'En production',
    stack: ['Angular', 'Django', 'PostgreSQL', 'Elasticsearch'],
    logo: '⚖️',
    description: 'Suite complète pour la gestion juridique des entreprises.',
    problem: 'Les PME n\'ont pas accès à des outils juridiques abordables et efficaces.',
    solution: 'Générateur de contrats, suivi des obligations légales et veille réglementaire automatisée.',
    metrics: {
      users: '600+ entreprises',
      uptime: '99.95%',
      performance: '10k+ contrats générés'
    },
    demoUrl: '#',
    screenshots: []
  }
];
