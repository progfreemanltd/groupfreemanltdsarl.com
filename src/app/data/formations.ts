export interface Formation {
  id: string;
  slug: string;
  title: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  theme: 'Web' | 'IA' | 'SaaS' | 'Growth';
  duration: string;
  price: number;
  students: number;
  rating: number;
  description: string;
  image: string;
  instructor: string;
  program: {
    module: string;
    chapters: string[];
  }[];
  prerequisites: string[];
  targetAudience: string[];
  whatYouWillLearn: string[];
  testimonials: {
    name: string;
    role: string;
    comment: string;
    rating: number;
  }[];
}

export const formations: Formation[] = [
  {
    id: '1',
    slug: 'fullstack-developer',
    title: 'Développeur Full Stack Moderne',
    level: 'Intermédiaire',
    theme: 'Web',
    duration: '12 semaines',
    price: 497,
    students: 1847,
    rating: 4.9,
    description: 'Maîtrisez le développement full stack avec React, Node.js, et les dernières technologies.',
    image: '💻',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'Frontend Moderne',
        chapters: ['React avancé', 'Next.js & SSR', 'TypeScript', 'Tailwind CSS', 'State Management']
      },
      {
        module: 'Backend & APIs',
        chapters: ['Node.js & Express', 'Bases de données', 'Authentication', 'GraphQL', 'Microservices']
      },
      {
        module: 'DevOps & Déploiement',
        chapters: ['Docker', 'CI/CD', 'AWS/Vercel', 'Monitoring', 'Performance']
      }
    ],
    prerequisites: ['Bases HTML/CSS/JS', 'Connaissances en programmation'],
    targetAudience: ['Développeurs juniors', 'Reconversion professionnelle', 'Freelances'],
    whatYouWillLearn: [
      'Construire des applications web complètes',
      'Maîtriser React et Next.js',
      'Créer des APIs REST et GraphQL',
      'Déployer en production',
      'Optimiser les performances'
    ],
    testimonials: [
      {
        name: 'Thomas M.',
        role: 'Développeur Full Stack',
        comment: 'Formation exceptionnelle qui m\'a permis de décrocher mon premier poste en tant que développeur.',
        rating: 5
      }
    ]
  },
  {
    id: '2',
    slug: 'ia-pratique',
    title: 'IA Pratique : De zéro à l\'Application',
    level: 'Débutant',
    theme: 'IA',
    duration: '8 semaines',
    price: 397,
    students: 2341,
    rating: 4.8,
    description: 'Créez vos premières applications IA avec GPT, Claude et les derniers LLMs.',
    image: '🤖',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'Fondamentaux de l\'IA',
        chapters: ['Introduction aux LLMs', 'APIs OpenAI', 'Prompt Engineering', 'Fine-tuning', 'Ethics']
      },
      {
        module: 'Applications Pratiques',
        chapters: ['Chatbots', 'Génération de contenu', 'Analyse de données', 'OCR & Vision', 'Voice AI']
      },
      {
        module: 'Intégration & Production',
        chapters: ['Architecture IA', 'Vector databases', 'RAG', 'Scaling', 'Monetization']
      }
    ],
    prerequisites: ['Bases en programmation', 'Anglais technique'],
    targetAudience: ['Développeurs', 'Entrepreneurs', 'Product Managers', 'Consultants'],
    whatYouWillLearn: [
      'Intégrer GPT-4 dans vos apps',
      'Créer des chatbots intelligents',
      'Automatiser avec l\'IA',
      'Monétiser vos solutions IA',
      'Comprendre les enjeux éthiques'
    ],
    testimonials: [
      {
        name: 'Sophie L.',
        role: 'Product Manager',
        comment: 'J\'ai pu intégrer l\'IA dans nos produits grâce à cette formation très pratique.',
        rating: 5
      }
    ]
  },
  {
    id: '3',
    slug: 'saas-zero-code',
    title: 'Lancer un SaaS Rentable',
    level: 'Intermédiaire',
    theme: 'SaaS',
    duration: '10 semaines',
    price: 697,
    students: 987,
    rating: 4.9,
    description: 'Créez, lancez et faites croître votre SaaS de A à Z avec une méthodologie éprouvée.',
    image: '🚀',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'Idéation & Validation',
        chapters: ['Trouver une idée', 'Market research', 'MVP', 'Pricing strategy', 'Business model']
      },
      {
        module: 'Développement',
        chapters: ['Tech stack', 'Architecture', 'Authentication', 'Payments', 'Analytics']
      },
      {
        module: 'Growth & Scale',
        chapters: ['SEO SaaS', 'Content marketing', 'Ads strategy', 'Onboarding', 'Retention']
      }
    ],
    prerequisites: ['Bases en développement web', 'Esprit entrepreneurial'],
    targetAudience: ['Entrepreneurs', 'Développeurs', 'Founders', 'Freelances'],
    whatYouWillLearn: [
      'Valider une idée SaaS',
      'Construire un MVP viable',
      'Gérer les paiements récurrents',
      'Acquérir vos premiers clients',
      'Scaler votre revenue'
    ],
    testimonials: [
      {
        name: 'Marc D.',
        role: 'Founder',
        comment: 'Grâce à cette formation, mon SaaS génère maintenant €5k MRR après 6 mois.',
        rating: 5
      }
    ]
  },
  {
    id: '4',
    slug: 'growth-marketing',
    title: 'Growth Marketing : Stratégies Avancées',
    level: 'Avancé',
    theme: 'Growth',
    duration: '6 semaines',
    price: 597,
    students: 1453,
    rating: 4.7,
    description: 'Maîtrisez Meta Ads, Google Ads, SEO et CRM pour faire exploser votre croissance.',
    image: '📈',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'Advertising Mastery',
        chapters: ['Meta Ads avancé', 'Google Ads', 'LinkedIn Ads', 'Retargeting', 'Attribution']
      },
      {
        module: 'SEO & Content',
        chapters: ['SEO technique', 'Content strategy', 'Link building', 'Analytics', 'Conversion']
      },
      {
        module: 'Automation & CRM',
        chapters: ['Marketing automation', 'Email sequences', 'CRM setup', 'Lead scoring', 'Analytics']
      }
    ],
    prerequisites: ['Expérience marketing', 'Bases Google Analytics', 'Budget ads disponible'],
    targetAudience: ['Growth marketers', 'CMOs', 'Founders', 'Freelances marketing'],
    whatYouWillLearn: [
      'Optimiser vos campagnes ads',
      'Réduire votre CAC de 40%',
      'Automatiser votre funnel',
      'Améliorer votre ROAS',
      'Scaler profitablement'
    ],
    testimonials: [
      {
        name: 'Laura B.',
        role: 'Growth Lead',
        comment: 'J\'ai divisé mon CAC par 3 en appliquant les stratégies de cette formation.',
        rating: 5
      }
    ]
  },
  {
    id: '5',
    slug: 'mobile-react-native',
    title: 'Développement Mobile React Native',
    level: 'Intermédiaire',
    theme: 'Web',
    duration: '9 semaines',
    price: 447,
    students: 1234,
    rating: 4.8,
    description: 'Créez des applications mobiles iOS et Android avec React Native.',
    image: '📱',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'React Native Fundamentals',
        chapters: ['Setup', 'Components', 'Navigation', 'State management', 'Styling']
      },
      {
        module: 'Features Natives',
        chapters: ['Camera', 'Geolocation', 'Push notifications', 'Offline mode', 'Biometrics']
      },
      {
        module: 'Publication',
        chapters: ['App Store', 'Google Play', 'CI/CD', 'Updates OTA', 'Monetization']
      }
    ],
    prerequisites: ['Connaissance React', 'JavaScript ES6+'],
    targetAudience: ['Développeurs React', 'Développeurs web', 'Freelances'],
    whatYouWillLearn: [
      'Créer des apps cross-platform',
      'Accéder aux APIs natives',
      'Publier sur les stores',
      'Optimiser les performances',
      'Gérer les updates'
    ],
    testimonials: [
      {
        name: 'Kevin R.',
        role: 'Mobile Developer',
        comment: 'Excellente formation pour passer du web au mobile rapidement.',
        rating: 5
      }
    ]
  },
  {
    id: '6',
    slug: 'typescript-avance',
    title: 'TypeScript Avancé pour Architectes',
    level: 'Avancé',
    theme: 'Web',
    duration: '5 semaines',
    price: 347,
    students: 892,
    rating: 4.9,
    description: 'Maîtrisez TypeScript à un niveau expert pour architecturer des applications scalables.',
    image: '🔷',
    instructor: 'Freeman LTD',
    program: [
      {
        module: 'Types Avancés',
        chapters: ['Generics', 'Conditional types', 'Mapped types', 'Template literals', 'Utility types']
      },
      {
        module: 'Architecture',
        chapters: ['Design patterns', 'Dependency injection', 'Monorepo', 'Testing', 'Performance']
      },
      {
        module: 'Production',
        chapters: ['Build optimization', 'Error handling', 'Documentation', 'Migration', 'Best practices']
      }
    ],
    prerequisites: ['TypeScript intermédiaire', 'Expérience en architecture'],
    targetAudience: ['Développeurs senior', 'Tech leads', 'Architectes logiciel'],
    whatYouWillLearn: [
      'Maîtriser les types avancés',
      'Architecturer des apps scalables',
      'Optimiser la compilation',
      'Implémenter des patterns',
      'Former votre équipe'
    ],
    testimonials: [
      {
        name: 'Alexandre P.',
        role: 'Tech Lead',
        comment: 'Formation technique de très haut niveau, exactement ce que je cherchais.',
        rating: 5
      }
    ]
  }
];
