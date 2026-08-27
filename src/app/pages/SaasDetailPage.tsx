import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, CheckCircle, TrendingUp } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export function SaasDetailPage() {
  const { slug } = useParams();
  const { saasProjectsList } = useCMS();
  const project = saasProjectsList.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#06080F] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['JetBrains_Mono'] text-4xl font-bold text-white mb-4">
            404 - Projet non trouvé
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En production': return 'bg-[#0F6E56]';
      case 'Beta': return 'bg-[#185FA5]';
      case 'Stealth': return 'bg-[#3C3489]';
      default: return 'bg-[#6B7A99]';
    }
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className={`${getStatusColor(project.status)} px-4 py-2 rounded-lg`}>
              <span className="font-['JetBrains_Mono'] text-xs text-white tracking-wider uppercase">
                {project.status}
              </span>
            </div>
            <div className="text-[#185FA5] border border-[#185FA5]/30 px-3 py-2 rounded-lg text-xs font-['JetBrains_Mono'] tracking-wider uppercase">
              {project.vertical}
            </div>
          </div>

          <div className="flex items-start gap-6 mb-6">
            <div className="text-8xl">{project.logo}</div>
            <div className="flex-1">
              <h1 className="font-['JetBrains_Mono'] text-4xl sm:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>
              <p className="font-['Inter'] text-xl text-[#6B7A99] mb-6">
                {project.tagline}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[#185FA5]/10 border border-[#185FA5]/20 rounded-lg text-sm font-['JetBrains_Mono'] text-[#E8F2FB]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.demoUrl && (
            <div className="flex gap-4">
              <a
                href={project.demoUrl}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#185FA5] to-[#0F6E56] rounded-xl font-['JetBrains_Mono'] font-bold text-white tracking-wide hover:scale-105 transition-all"
              >
                <ExternalLink size={20} />
                Tester la démo
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/15 rounded-xl font-['JetBrains_Mono'] font-bold text-[#E8F2FB] tracking-wide hover:bg-white/5 transition-all"
              >
                Projet similaire ?
              </a>
            </div>
          )}
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Problem */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
                Le problème
              </h2>
            </div>
            <p className="font-['Inter'] text-lg text-[#E8F2FB] leading-relaxed">
              {project.problem}
            </p>
          </motion.section>

          {/* Solution */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-[#0F6E56]" />
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
                Notre solution
              </h2>
            </div>
            <p className="font-['Inter'] text-lg text-[#E8F2FB] leading-relaxed">
              {project.solution}
            </p>
          </motion.section>

          {/* Metrics */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#185FA5]/20 to-[#0F6E56]/20 backdrop-blur-xl border border-[#185FA5]/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#185FA5]" />
              <h2 className="font-['JetBrains_Mono'] text-2xl font-bold text-white">
                Résultats & métriques
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(project.metrics).map(([key, value]) => (
                value && (
                  <div key={key} className="bg-[#0A1628]/50 backdrop-blur-sm rounded-xl p-6">
                    <div className="font-['JetBrains_Mono'] text-3xl font-bold text-white mb-2">
                      {value}
                    </div>
                    <div className="font-['Inter'] text-sm text-[#6B7A99] capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                )
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center bg-[#0A1628]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
          >
            <h2 className="font-['JetBrains_Mono'] text-3xl font-bold text-white mb-4">
              Vous avez un projet similaire ?
            </h2>
            <p className="font-['Inter'] text-lg text-[#6B7A99] mb-8 max-w-2xl mx-auto">
              Nous pouvons créer votre SaaS sur mesure avec la même rigueur et les mêmes résultats.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#185FA5] to-[#0F6E56] rounded-xl font-['JetBrains_Mono'] font-bold text-white tracking-wide hover:scale-105 transition-all"
            >
              Discuter de mon projet
            </Link>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
