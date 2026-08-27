import { motion } from 'motion/react';
import { Users, Target, TrendingUp, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

export function ManagementServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#032014] via-[#047857] to-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-sm font-semibold tracking-wide uppercase mb-6">
              <Users size={16} />
              Management & Conseil Stratégique
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Conseil & <span className="text-emerald-300">Transformation Managériale</span>
            </h1>

            <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Accompagnement des dirigeants, optimisation des processus opérationnels, gouvernance d'entreprise et conduite du changement.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-emerald-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Solliciter une Mission de Conseil <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Offres de Conseil & Accompagnement</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une expertise éprouvée pour structurer la croissance de votre organisation et sécuriser vos décisions managériales.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Conseil en Stratégie & COMEX</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Définition de la vision stratégique, audits organisationnels et accompagnement personnalisé des comités de direction.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Optimisation des Processus</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Reconception des workflows métiers, réduction des coûts opérationnels et mise en place d'indicateurs de performance (KPIs).
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Conduite du Changement & RSE</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Accompagnement des équipes dans la transition numérique, formation au leadership et intégration des critères RSE.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Besoin d'un audit de gouvernance ou d'un conseil stratégique ?</h3>
            <p className="text-gray-400 text-sm">Nos consultants seniors s'engagent à vos côtés avec discrétion et rigueur.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all">
            Prendre Rendez-vous
          </Link>
        </div>
      </section>

    </div>
  );
}
