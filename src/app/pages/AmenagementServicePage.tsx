import { motion } from 'motion/react';
import { Ruler, Palette, Sparkles, Layout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function AmenagementServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#1c0738] via-[#6d28d9] to-purple-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-purple-200 text-sm font-semibold tracking-wide uppercase mb-6">
              <Ruler size={16} />
              Aménagement & Design d'Espaces
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Architecture d'Intérieur & <span className="text-purple-200">Space Planning</span>
            </h1>

            <p className="text-lg sm:text-xl text-purple-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Conception d'espaces professionnels, sièges sociaux, boutiques et résidences privées alliant esthétisme et ergonomie.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-purple-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Demander un projet d'Aménagement <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Prestations de Design & Second Œuvre</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transformez vos environnements de travail et de vie grâce à une réflexion esthétique et fonctionnelle sur-mesure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Space Planning & Coworking</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Optimisation des m² pour bureaux modernes, aménagement d'espaces collaboratifs et zones de détente pour collaborateurs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6">
              <Palette size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Design d'Intérieur & Mobilier</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Sélection rigoureuse des matériaux, palette chromatique, mobilier sur-mesure et luminaires architecturaux.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi des Travaux Second Œuvre</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Coordination des menuisiers, électriciens, peintres et agenceurs jusqu'à la réception parfaite des lieux.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Envie de réagencer vos locaux d'entreprise ?</h3>
            <p className="text-gray-400 text-sm">Rencontrez nos designers d'intérieur pour concrétiser vos idées d'aménagement.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all">
            Planifier un Rendez-vous Design
          </Link>
        </div>
      </section>

    </div>
  );
}
