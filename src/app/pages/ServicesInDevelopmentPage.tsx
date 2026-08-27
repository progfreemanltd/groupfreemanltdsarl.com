import { motion } from 'motion/react';
import { 
  Truck, 
  PackageCheck, 
  Store, 
  Fuel, 
  Building2, 
  GraduationCap, 
  Clapperboard, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Compass, 
  Globe, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Link } from 'react-router';

const upcomingServices = [
  {
    id: 'transport',
    name: 'Freeman Transport & Logistique',
    tagline: 'Transport fret & solutions logistiques de pointe',
    category: 'Logistique & Mobility',
    icon: Truck,
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
    phase: 'Lancement Q4 2026',
    status: 'Phase de structuration de la flotte',
    description: 'Une flotte moderne de véhicules de transport de marchandises interurbain et transfrontalier, avec suivi géolocalisé en temps réel et gestion optimisée de la chaîne d’approvisionnement.'
  },
  {
    id: 'express',
    name: 'Freeman Express Shipping',
    tagline: 'Expédition ultra-rapide & fret international',
    category: 'Express Shipping',
    icon: PackageCheck,
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-200',
    phase: 'Lancement Q1 2027',
    status: 'Partenariats douaniers & aériens',
    description: 'Services d’expéditions express de colis et documents internationaux avec procédures de dédouanement accélérées et conciergerie logistique B2B & B2C.'
  },
  {
    id: 'retails',
    name: 'Freeman Retails',
    tagline: 'Réseau de magasins & hubs de distribution physiques',
    category: 'Commerce & Retail',
    icon: Store,
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    phase: 'Lancement Q2 2027',
    status: 'Recherche d’emplacements stratégiques',
    description: 'Chaîne de points de vente physiques modernes et phygitaux proposant des produits soigneusement sélectionnés, avec expérience d’achat simplifiée et retrait express.'
  },
  {
    id: 'hydrocarbures',
    name: 'Freeman Best Hydrocarbures',
    tagline: 'Distribution d’énergie & carburants éco-responsables',
    category: 'Énergie & Ressources',
    icon: Fuel,
    color: 'from-red-600 to-rose-700',
    badgeColor: 'bg-red-500/10 text-red-600 border-red-200',
    phase: 'Lancement Q3 2027',
    status: 'Obtention des agréments régulateurs',
    description: 'Réseau moderne de distribution de produits pétroliers, lubrifiants industriels et stations de recharge multi-énergies intégrant des standards environnementaux rigoureux.'
  },
  {
    id: 'immo',
    name: 'Freeman Prestige IMMO',
    tagline: 'Immobilier haut de gamme & gestion d’actifs d’exception',
    category: 'Immobilier & Luxe',
    icon: Building2,
    color: 'from-purple-600 to-indigo-800',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-200',
    phase: 'Lancement Q1 2027',
    status: 'Acquisition de portefeuilles fonciers',
    description: 'Promotion immobilière de standing, vente et location de résidences de prestige, villas contemporaines et immeubles d’affaires hautement sécurisés.'
  },
  {
    id: 'school',
    name: 'Freeman International School',
    tagline: 'Éducation internationale d’excellence & leadership',
    category: 'Éducation & Formation',
    icon: GraduationCap,
    color: 'from-cyan-600 to-blue-700',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    phase: 'Lancement Rentrée 2027',
    status: 'Conception architecturale du campus',
    description: 'Campus scolaire et académique bilingue de haut niveau formant les futurs leaders africains par la technologie, le leadership éthique et l’entrepreneuriat.'
  },
  {
    id: 'studio',
    name: 'Freeman Dream Studio',
    tagline: 'Production audiovisuelle, média & création visuelle',
    category: 'Média & Industrie Créative',
    icon: Clapperboard,
    color: 'from-violet-600 to-fuchsia-700',
    badgeColor: 'bg-violet-500/10 text-violet-600 border-violet-200',
    phase: 'Lancement Q4 2026',
    status: 'Équipement du studio de tournage',
    description: 'Studio créatif de pointe pour la réalisation de spots publicitaires, contenus de marque, podcasts, documentaires et effets visuels de niveau international.'
  },
  {
    id: 'foundation',
    name: 'Fondation AFRICA YOUTH FUTURE',
    tagline: 'Accélérateur de talents & bourses d’excellence pour la jeunesse',
    category: 'Impact Social & Jeunesse',
    icon: Globe,
    color: 'from-amber-600 to-yellow-700',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    phase: 'Prochainement',
    status: 'Constitution du comité exécutif',
    description: 'Fondation d’utilité privée visant à financer des projets d’avenir pour la jeunesse africaine via des bourses d’études, des programmes d’incubation et du mentorat.'
  },
  {
    id: 'ong',
    name: 'ONG FREEMAN GIVEN HAPPINESS',
    tagline: 'Humanitaire, accès aux soins & soutien aux communautés',
    category: 'Action Humanitaire',
    icon: Heart,
    color: 'from-emerald-600 to-green-700',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    phase: 'Prochainement',
    status: 'Planification des premières missions',
    description: 'Organisation non gouvernementale dédiée aux actions de solidarité, accès à l’eau potable, électrification rurale et soutien d’urgence aux familles démunies.'
  }
];

export function ServicesInDevelopmentPage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Banner Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#1a0429] via-[#24083a] to-[#1A2CB5] text-white overflow-hidden">
        {/* Background decorative grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1A2CB5]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#d4af37] text-sm font-semibold tracking-wide uppercase mb-6">
              <Sparkles size={16} />
              Feuille de Route & Hub d'Innovation
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Services & Filiales en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-amber-200 to-white">Développement</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Freeman Group construit l’avenir à travers une stratégie d’expansion ambitieuse. Découvez les 9 filiales et projets structurants en cours de finalisation.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-black text-[#d4af37]">9</div>
                <div className="text-xs text-gray-300 font-medium">Projets Majeurs</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-black text-white">6</div>
                <div className="text-xs text-gray-300 font-medium">Secteurs Stratégiques</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-black text-[#d4af37]">2026-2027</div>
                <div className="text-xs text-gray-300 font-medium">Horizons de Lancement</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="text-3xl font-black text-white">100%</div>
                <div className="text-xs text-gray-300 font-medium">Standards d'Excellence</div>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Grid of Upcoming Services */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-[#1A2CB5]/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Subtle Accent Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.color}`} />

                <div>
                  {/* Category & Status Header */}
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      {service.category}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${service.badgeColor}`}>
                      <Clock size={12} />
                      {service.phase}
                    </span>
                  </div>

                  {/* Icon Box & Title */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1A2CB5] transition-colors leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Status Indicator Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Compass size={14} className="text-[#1A2CB5]" />
                    <strong className="text-gray-700 font-semibold">{service.status}</strong>
                  </span>
                  <span className="text-gray-400 font-semibold group-hover:text-[#1A2CB5] transition-colors flex items-center gap-1">
                    Bientôt <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Partner / Investor Contact Banner */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-gray-900 via-black to-[#1A2CB5] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-2xl text-center md:text-left z-10">
            <span className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
              <CheckCircle2 size={16} /> Partenariats & Investissements
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-4">
              Vous souhaitez accompagner l'une de nos nouvelles filiales ?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Le groupe est ouvert aux opportunités de synergie, d'investissement stratégique et d'accords institutionnels pour accélérer le déploiement de ces pôles.
            </p>
          </div>

          <div className="shrink-0 z-10 w-full md:w-auto text-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d4af37] text-black hover:bg-white font-bold rounded-2xl text-base shadow-xl transition-all hover:scale-105 duration-300"
            >
              Contact Investisseur / Devis <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
