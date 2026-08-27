import { motion } from 'motion/react';
import {
  ShoppingBag, Truck, ShieldCheck, Globe, ArrowRight,
  CheckCircle2, PhoneCall, Link2, Package, ClipboardList,
  CreditCard, MapPin, Star, Zap, Users, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router';

const achatSteps = [
  {
    num: '01',
    icon: Link2,
    title: 'Envoyez-nous vos liens',
    desc: 'Sélectionnez vos articles sur n\'importe quel site marchand (Amazon, AliExpress, eBay, Shein, Zara, etc.) et envoyez-nous les liens via notre formulaire de devis. Pas de compte étranger requis.',
    color: 'from-blue-500 to-[#1A2CB5]'
  },
  {
    num: '02',
    icon: ClipboardList,
    title: 'Étude de faisabilité & devis',
    desc: 'Notre équipe étudie la disponibilité, la conformité douanière et le coût total (produit + frais d\'expédition + taxes). Vous recevez un devis détaillé transparent avant tout engagement.',
    color: 'from-purple-500 to-purple-700'
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Paiement & confirmation',
    desc: 'Vous validez la commande uniquement après réception et acceptation de votre devis. Paiement sécurisé via Mobile Money (MTN MoMo, Moov, Wave, Orange) ou virement. Zéro surprise.',
    color: 'from-emerald-500 to-emerald-700'
  },
  {
    num: '04',
    icon: Package,
    title: 'Achat & réception en entrepôt',
    desc: 'Freeman Achat Facile commande pour vous, réceptionne vos colis dans son entrepôt partenaire (Europe / Asie / USA), vérifie leur état et les prépare pour l\'expédition internationale.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    num: '05',
    icon: Truck,
    title: 'Livraison à votre porte au Bénin',
    desc: 'Vos articles sont acheminés par voie aérienne ou maritime selon urgence et volume, dédouanés par nos soins, puis livrés directement à votre domicile ou bureau à Cotonou et alentours.',
    color: 'from-rose-500 to-red-700'
  }
];

const expeditionSteps = [
  {
    num: '01',
    icon: MapPin,
    title: 'Générez votre adresse entrepôt',
    desc: 'Obtenez instantanément une adresse postale de réception dans notre entrepôt partenaire en Europe ou en Asie. Utilisez cette adresse comme destination de livraison sur n\'importe quel site marchand.',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    num: '02',
    icon: Package,
    title: 'Vos colis arrivent en entrepôt',
    desc: 'Le marchand livre directement à notre entrepôt. Nous réceptionnons, contrôlons visuellement et photographions vos colis. Vous êtes notifié dès réception.',
    color: 'from-violet-500 to-purple-700'
  },
  {
    num: '03',
    icon: Truck,
    title: 'Réexpédition & livraison au Bénin',
    desc: 'Nous regroupons vos colis, effectuons les formalités douanières et les acheminons vers votre adresse au Bénin ou dans les pays de la sous-région (Togo, Niger, Burkina Faso...).',
    color: 'from-teal-500 to-emerald-700'
  }
];

const avantages = [
  { icon: Globe, text: 'Accès à + de 100 sites marchands internationaux' },
  { icon: ShieldCheck, text: 'Contrôle qualité systématique à réception' },
  { icon: CreditCard, text: 'Paiement uniquement après validation du devis' },
  { icon: Zap, text: 'Traitement rapide des commandes urgentes' },
  { icon: Users, text: 'Accompagnement personnalisé de A à Z' },
  { icon: MessageSquare, text: 'Support client réactif 7j/7 via WhatsApp & mail' },
];

export function AchatLivraisonPage() {
  return (
    <div className="flex flex-col w-full bg-[#fcfcfd] min-h-screen font-['Inter']">

      {/* ======= HERO ======= */}
      <section className="relative pt-32 pb-24 bg-gradient-to-b from-[#0a0f2e] via-[#1A2CB5] to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#fcfcfd] to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#d4af37] text-sm font-bold tracking-wide uppercase mb-6">
              <ShoppingBag size={16} />
              Service Actif & Opérationnel
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
              Freeman{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-amber-200">
                Achat Facile
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed mb-10">
              Vous résidez au Bénin et souhaitez commander sur des sites étrangers&nbsp;?
              Freeman Achat Facile réceptionne vos colis à l'international et vous les livre directement chez vous.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-[#d4af37] text-black font-bold rounded-2xl shadow-xl hover:bg-white transition-all hover:scale-105 duration-300 flex items-center gap-2 text-base"
              >
                Obtenir un devis gratuit <ArrowRight size={18} />
              </Link>
              <a
                href="https://wa.me/22900000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2 text-base"
              >
                <PhoneCall size={18} /> Nous contacter sur WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======= INTRO : COMMENT ÇA MARCHE ======= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Text */}
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1A2CB5] bg-blue-50 px-3 py-1 rounded-full mb-4">
              Comment ça marche
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
              Freeman Achat Facile réceptionne vos colis et vous les livre au Bénin
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Freeman Achat Facile propose à ses clients un service de réception dans ses entrepôts partenaires,
              en Europe et à l'international, puis de réexpédition vers le Bénin ou dans les pays limitrophes,
              de colis contenant des articles achetés sur des sites marchands.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Cette prestation permet notamment aux clients résidant au Bénin de recevoir la livraison
              d'articles pour lesquels les marchands n'offrent pas de service de livraison vers leur pays.
            </p>

            <div className="space-y-3">
              {[
                'Étude de la faisabilité de vos achats',
                'Prise de contact direct avec les vendeurs',
                'Conseils et suggestions shopping personnalisés',
                'Vérification et contrôle qualité des colis reçus',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-gradient-to-br from-[#1A2CB5] to-[#1a0429] rounded-3xl p-10 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Star size={24} className="text-[#d4af37]" />
              </div>
              <div>
                <div className="font-black text-lg">+ de 100 sites</div>
                <div className="text-blue-200 text-sm">marchands maîtrisés</div>
              </div>
            </div>

            <p className="text-blue-100 leading-relaxed text-sm mb-6">
              Il est très important pour nous de vous accompagner dans vos achats en ligne car nous prenons
              chacune de vos dépenses à cœur. Avec notre expertise, nous faisons de votre projet d'achat
              en ligne une réussite.
            </p>

            <div className="space-y-2">
              {['Amazon', 'AliExpress', 'eBay', 'Shein', 'Zara', 'Nike', 'ASOS', 'Cdiscount'].map((site) => (
                <span key={site} className="inline-block mr-2 mb-2 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-bold">
                  {site}
                </span>
              ))}
              <span className="inline-block mr-2 mb-2 px-3 py-1 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full text-xs font-bold text-[#d4af37]">
                + bien d'autres…
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ======= SERVICE D'ACHAT EN LIGNE - 5 ÉTAPES ======= */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1A2CB5] bg-blue-50 px-3 py-1 rounded-full mb-4">
              Service d'Achat en Ligne
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Commandez n'importe où, livré chez vous en 5 étapes
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Du lien produit à votre porte — Freeman Achat Facile s'occupe de tout.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connector line desktop */}
            <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-rose-200 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {achatSteps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 shadow-md`}>
                    <step.icon size={24} className="text-white" />
                  </div>
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Étape {step.num}</div>
                  <h3 className="font-black text-gray-900 mb-2 text-sm leading-tight">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed flex-1">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A2CB5] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg"
            >
              <ClipboardList size={18} /> Demander un devis gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* ======= SERVICE D'EXPÉDITION - 3 ÉTAPES ======= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">
              Service d'Expédition
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Vous commandez vous-même ? On réceptionne et on réexpédie
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Utilisez notre adresse entrepôt comme destination de livraison, nous nous chargeons du reste.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {expeditionSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`} />
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon size={24} className="text-white" />
                </div>
                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Étape {step.num}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg"
            >
              <MapPin size={18} /> Générer mon adresse entrepôt
            </Link>
          </div>
        </div>
      </section>

      {/* ======= AVANTAGES CLÉS ======= */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-gray-900 mb-4">Pourquoi choisir Freeman Achat Facile ?</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">Une équipe d'experts dédiée à votre satisfaction et à la sécurité de chaque transaction.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantages.map((av, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1A2CB5]/10 flex items-center justify-center shrink-0">
                  <av.icon size={20} className="text-[#1A2CB5]" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{av.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CTA FINAL ======= */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-gradient-to-r from-[#1a0429] via-[#1A2CB5] to-blue-700 rounded-3xl p-10 sm:p-16 text-white text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-6">
                <Star size={14} /> + de 100 sites expérimentés
              </div>

              <h2 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
                Passez de visiteur à client<br />ici et maintenant
              </h2>
              <p className="text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
                Vous aimez shopper ? Vous aimez les offres ? Soyez le premier à bénéficier de nos services
                d'achat international et de livraison rapide au Bénin.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-[#d4af37] text-black font-black rounded-2xl hover:bg-white transition-all shadow-xl hover:scale-105 duration-300 flex items-center gap-2"
                >
                  Obtenir mon devis gratuit <ArrowRight size={18} />
                </Link>
                <a
                  href="https://wa.me/22900000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                >
                  <PhoneCall size={18} /> WhatsApp Direct
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
