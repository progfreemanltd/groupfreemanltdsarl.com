import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Users, Star, CheckCircle, ShoppingCart } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export function FormationDetailPage() {
  const { slug } = useParams();
  const { formationsList } = useCMS();
  const formation = formationsList.find(f => f.slug === slug);

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#06080F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['JetBrains_Mono'] text-4xl font-bold text-white mb-4">
            404 - Formation non trouvée
          </h1>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#185FA5] hover:text-[#0F6E56] transition-colors"
          >
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'text-[#0F6E56] border-[#0F6E56]';
      case 'Intermédiaire': return 'text-[#185FA5] border-[#185FA5]';
      case 'Avancé': return 'text-[#3C3489] border-[#3C3489]';
      default: return 'text-[#6B7A99] border-[#6B7A99]';
    }
  };

  const handleCheckout = () => {
    // In production, this would redirect to Lemon Squeezy or Gumroad
    window.open('https://lemonsqueezy.com/checkout', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#06080F]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#06080F]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#E8F2FB] hover:text-[#185FA5] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-['Inter'] text-sm">Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`px-4 py-2 border-2 rounded-lg ${getLevelColor(formation.level)}`}>
                  <span className="font-['JetBrains_Mono'] text-xs font-bold tracking-wider uppercase">
                    {formation.level}
                  </span>
                </div>
                <div className="text-[#185FA5] border border-[#185FA5]/30 px-3 py-2 rounded-lg text-xs font-['JetBrains_Mono'] tracking-wider uppercase">
                  {formation.theme}
                </div>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <div className="text-8xl">{formation.image}</div>
                <div className="flex-1">
                  <h1 className="font-['JetBrains_Mono'] text-4xl sm:text-5xl font-bold text-white mb-4">
                    {formation.title}
                  </h1>
                  <p className="font-['Inter'] text-xl text-[#6B7A99] mb-6">
                    {formation.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-[#6B7A99]">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{formation.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span>{formation.students}+ apprenants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="fill-[#185FA5] text-[#185FA5]" />
                      <span>{formation.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What You Will Learn */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white mb-6">
                Ce que vous allez apprendre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formation.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0F6E56] flex-shrink-0 mt-0.5" />
                    <span className="font-['Inter'] text-[#E8F2FB]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Program */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white mb-6">
                Programme détaillé
              </h2>
              <div className="space-y-6">
                {formation.program.map((module, index) => (
                  <div key={index} className="border-l-2 border-[#185FA5]/30 pl-6">
                    <h3 className="font-['JetBrains_Mono'] text-lg font-bold text-white mb-3">
                      {module.module}
                    </h3>
                    <ul className="space-y-2">
                      {module.chapters.map((chapter, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#6B7A99]">
                          <div className="w-1.5 h-1.5 bg-[#185FA5] rounded-full" />
                          {chapter}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Prerequisites */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white mb-4">
                Prérequis
              </h2>
              <ul className="space-y-2">
                {formation.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#E8F2FB]">
                    <div className="w-1.5 h-1.5 bg-[#6B7A99] rounded-full" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </motion.section>

            {/* Target Audience */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white mb-4">
                Pour qui ?
              </h2>
              <div className="flex flex-wrap gap-3">
                {formation.targetAudience.map((audience, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-[#185FA5]/10 border border-[#185FA5]/20 rounded-lg text-sm font-['Inter'] text-[#E8F2FB]"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Testimonials */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white mb-6">
                Avis des apprenants
              </h2>
              <div className="space-y-4">
                {formation.testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#185FA5] text-[#185FA5]" />
                      ))}
                    </div>
                    <p className="font-['Inter'] text-[#E8F2FB] mb-4">
                      "{testimonial.comment}"
                    </p>
                    <div>
                      <div className="font-['JetBrains_Mono'] text-sm font-bold text-white">
                        {testimonial.name}
                      </div>
                      <div className="font-['Inter'] text-xs text-[#6B7A99]">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <div className="bg-gradient-to-br from-[#185FA5]/20 to-[#0F6E56]/20 backdrop-blur-xl border border-[#185FA5]/30 rounded-2xl p-8">
                <div className="text-6xl mb-6 text-center">{formation.image}</div>
                
                <div className="text-center mb-6">
                  <div className="font-['JetBrains_Mono'] text-5xl font-bold text-white mb-2">
                    €{formation.price}
                  </div>
                  <div className="font-['Inter'] text-sm text-[#6B7A99]">
                    Accès à vie
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#185FA5] to-[#0F6E56] rounded-xl font-['JetBrains_Mono'] font-bold text-white tracking-wide hover:scale-105 transition-all mb-4"
                >
                  <ShoppingCart size={20} />
                  Acheter maintenant
                </button>

                <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7A99]">Durée</span>
                    <span className="text-white font-['JetBrains_Mono']">{formation.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7A99]">Niveau</span>
                    <span className="text-white font-['JetBrains_Mono']">{formation.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7A99]">Apprenants</span>
                    <span className="text-white font-['JetBrains_Mono']">{formation.students}+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7A99]">Instructeur</span>
                    <span className="text-white font-['JetBrains_Mono']">{formation.instructor}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-[#6B7A99] mb-2">
                    <CheckCircle className="w-4 h-4 text-[#0F6E56]" />
                    <span>Accès à vie</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7A99] mb-2">
                    <CheckCircle className="w-4 h-4 text-[#0F6E56]" />
                    <span>Certificat de réussite</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6B7A99]">
                    <CheckCircle className="w-4 h-4 text-[#0F6E56]" />
                    <span>Garantie satisfait ou remboursé 30j</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
