export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  desc: string;
  color: string;
  content?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
}

export const staticArticles: BlogArticle[] = [
  {
    id: "1",
    title: "Comment l'IA redéfinit la gestion de la Supply Chain en 2026",
    category: "Digital & IA",
    date: "12 Mars 2026",
    readTime: "5 min",
    desc: "Plongée au cœur de notre dernier projet logistique automatisé et des gains de performance obtenus via nos algorithmes prédictifs.",
    color: "#1A2CB5",
    content: "L'intelligence artificielle n'est plus une promesse lointaine, mais un outil opérationnel majeur. En 2026, nos algorithmes prédictifs permettent d'optimiser les flux de stock en temps réel..."
  },
  {
    id: "2",
    title: "Construction Bas Carbone : Le nouveau standard du BTP",
    category: "BTP & Immobilier",
    date: "05 Mars 2026",
    readTime: "7 min",
    desc: "Analyse des matériaux biosourcés et de notre méthodologie de construction employée sur le projet Éco-Quartier Sud.",
    color: "#ea580c",
    content: "Face à l'urgence climatique, le secteur du BTP se réinvente. La méthodologie bas carbone s'appuie sur le bois, le béton de chanvre et l'économie circulaire..."
  },
  {
    id: "3",
    title: "Le Top Management face aux défis de l'hypercroissance",
    category: "Management",
    date: "28 Fév 2026",
    readTime: "4 min",
    desc: "Retours d'expérience de notre pôle Stratégie sur l'accompagnement des Scale-ups dans leur structuration opérationnelle.",
    color: "#047857",
    content: "L'hypercroissance est un sport de haut niveau. Structurer la gouvernance, aligner les objectifs et maintenir la culture d'entreprise sont les clés de la réussite..."
  },
  {
    id: "4",
    title: "L'expérience client 3.0 dans l'hôtellerie de luxe",
    category: "Hôtellerie",
    date: "15 Fév 2026",
    readTime: "6 min",
    desc: "Comment l'hybridation entre services physiques premium et conciergerie digitale transforme le secteur hôtelier.",
    color: "#b91c1c",
    content: "L'hôtellerie haut de gamme fait face à une double attente : un service humain irréprochable et des outils digitaux fluides et discrets..."
  },
  {
    id: "5",
    title: "Space Planning : Repenser le bureau post-hybride",
    category: "Aménagement",
    date: "02 Fév 2026",
    readTime: "8 min",
    desc: "Concevoir des espaces de travail qui favorisent la collaboration stratégique, illustré par notre dernier aménagement de campus.",
    color: "#6d28d9",
    content: "Le bureau traditionnel est mort. Aujourd'hui, les espaces physiques doivent être des lieux de rencontre, de créativité et d'échange, complétés par le télétravail..."
  },
  {
    id: "6",
    title: "Phygitalisation : L'avenir du réseau Retail",
    category: "Commerce",
    date: "20 Jan 2026",
    readTime: "5 min",
    desc: "Stratégies d'intégration web-to-store pour les réseaux de distribution d'envergure nationale.",
    color: "#0369a1",
    content: "Le commerce physique et le e-commerce ne s'opposent plus, ils fusionnent. Les bornes connectées, le click & collect et la personnalisation transforment le parcours client..."
  }
];
