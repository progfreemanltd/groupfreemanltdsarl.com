import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'motion/react';
import { Monitor, HardHat, Users, Hotel, Ruler, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router';

// Définition des pôles
const poles = [
  { 
    id: 'digital', 
    label: 'Digital', 
    icon: Monitor, 
    color: '#1A2CB5', 
    desc: "Développement fullstack, Intelligence Artificielle et solutions technologiques sur-mesure.",
    details: [
      "Création de plateformes SaaS scalables",
      "Développement web & mobile sur-mesure",
      "Audits technologiques et architecture Cloud",
      "Intégration de modèles IA et automatisations"
    ]
  },
  { 
    id: 'btp', 
    label: 'BTP', 
    icon: HardHat, 
    color: '#ea580c', 
    desc: "Construction, gros œuvre et gestion d'infrastructures d'envergure.",
    details: [
      "Promotion immobilière et construction neuve",
      "Gros œuvre et réhabilitation globale",
      "Gestion de maîtrise d'œuvre (MOE)",
      "Solutions durables et matériaux éco-responsables"
    ]
  },
  { 
    id: 'management', 
    label: 'Management', 
    icon: Users, 
    color: '#047857', 
    desc: "Conseil en stratégie, transformation organisationnelle et conduite du changement.",
    details: [
      "Accompagnement des comités de direction",
      "Restructuration et optimisation des coûts partagés",
      "Conduite de la transition numérique et RSE",
      "Formation du Top Management"
    ]
  },
  { 
    id: 'hotellerie', 
    label: 'Hôtellerie', 
    icon: Hotel, 
    color: '#b91c1c', 
    desc: "Ingénierie hôtelière, exploitation et valorisation d'actifs touristiques.",
    details: [
      "Conception de concepts hôteliers premium",
      "Gestion d'exploitation et management d'équipes",
      "Optimisation du RevPAR et yield management",
      "Digitalisation de l'expérience client"
    ]
  },
  { 
    id: 'amenagement', 
    label: 'Aménagement', 
    icon: Ruler, 
    color: '#6d28d9', 
    desc: "Architecture d'intérieur, design d'espaces professionnels ou particuliers.",
    details: [
      "Space planning pour bureaux et coworking",
      "Design d'intérieur et sélection de mobilier",
      "Suivi des travaux de second œuvre",
      "Optimisation de la performance d'usage"
    ]
  },
  { 
    id: 'commerce', 
    label: 'Commerce', 
    icon: ShoppingBag, 
    color: '#0369a1', 
    desc: "Structuration de réseaux retail, commerce de détail et distribution.",
    details: [
      "Développement de points de vente physiques",
      "Stratégie phygitale (web-to-store, click & collect)",
      "Sourcing, achats et supply chain",
      "Marketing opérationnel et trade marketing"
    ]
  }
];

export function CorporateServicesPage() {
  const { pole } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activePole = pole || searchParams.get('tab') || 'digital';
  const currentTab = poles.some(p => p.id === activePole) ? activePole : 'digital';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value }, { replace: true });
  };

  return (
    <div className="flex flex-col w-full bg-[#f8f9fa] min-h-screen font-['Inter']">
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-6">
              Nos <span className="text-[#1A2CB5]">Pôles d'Expertise</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Séléctionnez un domaine ci-dessous pour découvrir comment Freeman Group structure sa valeur ajoutée.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interface à Onglets */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Tabs.Root value={currentTab} onValueChange={handleTabChange} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            <Tabs.List className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 lg:min-w-[280px] no-scrollbar shrink-0" aria-label="Nos Pôles d'Expertise">
              {poles.map(pole => (
                <Tabs.Trigger 
                  key={pole.id} 
                  value={pole.id}
                  className="group flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-3 px-6 py-4 rounded-2xl text-left transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:shadow-black/5 data-[state=active]:border-transparent border border-gray-200 bg-transparent data-[state=inactive]:hover:bg-white data-[state=inactive]:hover:border-gray-300 min-w-[140px] sm:min-w-fit outline-none focus-visible:ring-2 focus-visible:ring-[#1A2CB5]"
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ 
                      backgroundColor: currentTab === pole.id ? `${pole.color}15` : '#f3f4f6', 
                      color: currentTab === pole.id ? pole.color : '#9ca3af' 
                    }}
                  >
                    <pole.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-semibold transition-colors mt-2 sm:mt-0 ${currentTab === pole.id ? 'text-black' : 'text-gray-500 group-hover:text-gray-800'}`}>
                    {pole.label}
                  </span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <div className="flex-1">
              {poles.map(pole => (
                <Tabs.Content key={pole.id} value={pole.id} className="outline-none" tabIndex={-1}>
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 h-full relative overflow-hidden"
                  >
                    {/* Background blob for style */}
                    <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20" style={{ backgroundColor: pole.color }}></div>
                    
                    <div className="relative z-10 text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-6" style={{ backgroundColor: `${pole.color}15`, color: pole.color }}>
                        <pole.icon className="w-4 h-4" />
                        PÔLE {pole.label.toUpperCase()}
                      </div>
                      
                      <h2 className="text-3xl sm:text-4xl font-black text-black mb-6">Expertise en {pole.label}</h2>
                      <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                        {pole.desc}
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6 mb-12">
                        {pole.details.map((detail, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-[#f8f9fa] border border-gray-100">
                            <div className="w-2 h-2 mt-2 rounded-full shrink-0" style={{ backgroundColor: pole.color }}></div>
                            <span className="font-medium text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Appel d'action spécifique par pole */}
                      {pole.id === 'digital' ? (
                        <div className="mt-8 p-8 rounded-2xl border" style={{ backgroundColor: `${pole.color}05`, borderColor: `${pole.color}20` }}>
                          <h4 className="font-bold text-black mb-2 text-lg">Entrez dans la dimension technologique</h4>
                          <p className="text-gray-600 mb-6">Découvrez notre site vitrine existant dédié 100% au digital, avec nos SaaS innovants et nos formations.</p>
                          <Link to="/digital" className="inline-flex items-center px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105 shadow-md" style={{ backgroundColor: pole.color }}>
                            Visiter le portail Digital <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-8">
                          <Link to="/contact" className="inline-flex items-center px-6 py-3 rounded-full text-white font-semibold transition-transform hover:scale-105 shadow-md bg-black">
                            Discuter d'un projet {pole.label} <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Tabs.Content>
              ))}
            </div>
          </Tabs.Root>

        </div>
      </section>

    </div>
  );
}
