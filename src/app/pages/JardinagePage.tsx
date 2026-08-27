import { motion } from 'motion/react';
import { Leaf, Ruler, Sun, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';

export function JardinagePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0f281e] via-[#047857] to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-sm font-semibold tracking-wide uppercase mb-6">
              <Leaf size={16} />
              Filiale Actives & Aménagement Vert
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Freeman <span className="text-emerald-300">Jardin & Paysage</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Conception paysagère, aménagement d'espaces verts d'exception, entretien de jardins privatifs et espaces verts d'entreprises.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-emerald-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Demander une étude paysagère <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Expertises Paysagères</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des solutions sur-mesure pour sublimer vos espaces extérieurs et valoriser vos actifs immobiliers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Ruler size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Design & Architecture Végétale</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Création de plans 3D, sélection de plantes d'ornement adaptées au climat local et aménagement d'allées.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
              <Sun size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Systèmes d'Arrosage Automatique</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Installation d'arrosage goutte-à-goutte économique et automatisé pour maintenir la fraîcheur de vos gazons.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Entretien & Taille de Présentation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Contrats d'entretien périodique, tonte de pelouse, élagage et traitement écologique des plantes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-emerald-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Un projet d'aménagement extérieur ?</h3>
            <p className="text-emerald-200 text-sm">Nos paysagistes interviennent sur tout type de propriété privée ou commerciale.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-emerald-500 text-gray-950 font-bold rounded-xl hover:bg-white transition-all">
            Demander un devis Jardinage
          </Link>
        </div>
      </section>

    </div>
  );
}
