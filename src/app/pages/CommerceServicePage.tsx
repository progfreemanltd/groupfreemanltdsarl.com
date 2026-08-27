import { motion } from 'motion/react';
import { Store, ShoppingCart, Truck, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function CommerceServicePage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">
      
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-[#021f30] via-[#0369a1] to-sky-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-sm font-semibold tracking-wide uppercase mb-6">
              <Store size={16} />
              Commerce & Distribution Phygitale
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Commerce & <span className="text-sky-200">Distribution Retail</span>
            </h1>

            <p className="text-lg sm:text-xl text-sky-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Développement de réseaux de vente physiques, stratégies phygitales (e-commerce & web-to-store) et optimisation de supply chain.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-sky-400 text-gray-950 font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Échanger avec le Pôle Commerce <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Nos Expertises Retail & Commerce</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Accélérez la distribution de vos marques et optimisez vos points de vente grâce à nos compétences intégrées.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6">
              <Store size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Développement de Points de Vente</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Implantation de boutiques, négociation de baux commerciaux, merchandising visuel et gestion d'enseignes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <ShoppingCart size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Stratégie Phygitale Omnicanale</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Synchronisation stocks physiques & e-commerce, click & collect, paiement mobile et programmes de fidélité.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
              <Truck size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sourcing & Achats Groupés</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Négociation fournisseurs à l'international, optimisation de la logistique d'approvisionnement et réduction des coûts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gray-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">Un projet de distribution ou de franchise ?</h3>
            <p className="text-gray-400 text-sm">Découvrez nos solutions de partenariat et de développement commercial.</p>
          </div>
          <Link to="/contact" className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-white hover:text-black transition-all">
            Contact Pôle Commerce
          </Link>
        </div>
      </section>

    </div>
  );
}
