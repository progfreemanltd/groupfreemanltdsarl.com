import { motion } from 'motion/react';
import { Monitor, Cpu, Code2, Cloud, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

export function DigitalServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#0a0f29] via-[#1A2CB5] to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#d4af37] text-sm font-semibold tracking-wide uppercase mb-6">
              <Monitor size={16} />
              Pôle d'Expertise & Solutions Digitales
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Pôle <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-[#d4af37] to-white">Digital & IA</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Ingénierie logicielle sur-mesure, architectures Cloud résilientes, développement SaaS et intégration avancée de modèles d’Intelligence Artificielle.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/digital"
                className="px-8 py-3.5 bg-[#d4af37] text-black font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Explorer le Portail Digital Dedicated <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-base"
              >
                Demander un devis Tech
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Content Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Domaines d'Intervention Digital</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            De l'idéation au déploiement en production, Freeman Group conçoit des architectures logicielles modernes et sécurisées.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1A2CB5] flex items-center justify-center mb-6">
              <Code2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Développement Web & Mobile</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Applications web React/Next.js et mobiles natives à haute performance avec designs soignés et UX réactive.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligence Artificielle</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Intégration de modèles LLM, automatisation de processus métiers, vision par ordinateur et agents IA autonomes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
              <Cloud size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">SaaS & Plateformes Cloud</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Conception de solutions SaaS multi-tenants scalables, microservices et gestion d'infrastructure Cloud DevOps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Audit & Architecture</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Audits de sécurité, revue de code, optimisation des performances et accompagnement de la transformation SI.
            </p>
          </div>
        </div>
      </section>

      {/* Portal Banner CTA */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-gray-950 via-[#1A2CB5] to-indigo-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <span className="text-[#d4af37] text-xs font-bold uppercase tracking-wider">Espace 100% Digital</span>
            <h3 className="text-2xl sm:text-3xl font-black mb-3">Découvrez notre Portail Digital & Formations</h3>
            <p className="text-gray-300 text-sm max-w-xl">
              Consultez nos logiciels SaaS, nos projets open source et rejoignez nos sessions de formation professionnelle en développement et IA.
            </p>
          </div>
          <Link
            to="/digital"
            className="px-8 py-4 bg-[#d4af37] text-black font-bold rounded-2xl hover:bg-white transition-all shadow-xl whitespace-nowrap"
          >
            Accéder au Portail Digital →
          </Link>
        </div>
      </section>

    </div>
  );
}
