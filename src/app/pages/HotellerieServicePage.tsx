import { motion } from 'motion/react';
import { Hotel, KeyRound, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function HotellerieServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#2a0404] via-[#b91c1c] to-rose-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-rose-200 text-sm font-semibold tracking-wide uppercase mb-6">
              <Hotel size={16} />
              Ingénierie Hôtelière & Asset Management
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Hôtellerie & <span className="text-rose-200">Tourisme Premium</span>
            </h1>

            <p className="text-lg sm:text-xl text-rose-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Conception de concepts hôteliers d'exception, valorisation d'actifs touristiques et optimisation de l'expérience client haut de gamme.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-rose-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Discuter d'un projet Hôtelier <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Solutions en Ingénierie Hôtelière</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Accompagnement complet des investisseurs et propriétaires d'établissements hôteliers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
              <Hotel size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Conception de Concepts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Positionnement de marque, storytelling hôtelier, design d'expérience et programmation d'espaces réceptifs.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Yield Management & RevPAR</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Optimisation des politiques tarifaires, gestion des canaux de distribution et maximisation des revenus par chambre disponible.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <KeyRound size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Management d'Exploitation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Audits de qualité de service, digitalisation du parcours client et formation des équipes de conciergerie et réception.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Un actif hôtelier à moderniser ou valoriser ?</h3>
            <p className="text-gray-400 text-sm">Nos experts en ingénierie hôtelière répondent à vos enjeux d'investissement.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all">
            Contactez notre Pôle Hôtellerie
          </Link>
        </div>
      </section>

    </div>
  );
}
