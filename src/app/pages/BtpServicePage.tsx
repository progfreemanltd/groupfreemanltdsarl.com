import { motion } from 'motion/react';
import { HardHat, Building, Layers, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

export function BtpServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#291304] via-[#c2410c] to-amber-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-200 text-sm font-semibold tracking-wide uppercase mb-6">
              <HardHat size={16} />
              Pôle BTP & Immobilier
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              BTP & <span className="text-amber-300">Immobilier Structurant</span>
            </h1>

            <p className="text-lg sm:text-xl text-orange-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Construction neuve, promotion immobilière haut de gamme, maîtrise d’œuvre et infrastructures durables au service des territoires.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-amber-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Proposer un Projet / Devis BTP <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Content Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Domaines d'Expertise en BTP</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une méthodologie rigoureuse garantissant la qualité d'exécution, le respect des délais et l'efficience budgétaire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
              <Building size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Promotion Immobilière</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Développement de complexes résidentiels, Immeubles de grand standing et espaces commerciaux clés en main.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Gros Œuvre & Structure</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Réalisation de structures béton armé, fondations spéciales, charpentes et réhabilitation d'ouvrages existants.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
              <Compass size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Maîtrise d'Œuvre (MOE)</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Direction des travaux, pilotage de chantier, contrôle technique et coordination des corps d'état secondaires.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Vous avez un projet de construction ou de rénovation ?</h3>
            <p className="text-gray-400 text-sm">Nos ingénieurs et architectes sont à votre disposition pour analyser votre cahier des charges.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all">
            Contactez notre Pôle BTP
          </Link>
        </div>
      </section>

    </div>
  );
}
