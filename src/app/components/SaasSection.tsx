import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';
import { useCMS } from '../context/CMSContext';

type FilterType = 'Tous' | 'IA / LLM' | 'Niche Métier' | 'Productivité Dev';

export function SaasSection() {
  const { saasProjectsList } = useCMS();
  const [activeFilter, setActiveFilter] = useState<FilterType>('Tous');

  const filters: FilterType[] = ['Tous', 'IA / LLM', 'Niche Métier', 'Productivité Dev'];

  const filteredProjects = activeFilter === 'Tous'
    ? saasProjectsList
    : saasProjectsList.filter(project => project.vertical === activeFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En production': return 'text-blue-500';
      case 'Beta': return 'text-amber-500';
      case 'Stealth': return 'text-purple-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center mb-16 text-center pt-8">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-card px-6 py-2 mb-6 rounded-full inline-flex items-center shadow-sm"
           >
             <Layers className="w-4 h-4 text-blue-600 mr-2" />
             <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.3em] font-bold text-slate-600">SAAS PORTFOLIO</span>
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-['JetBrains_Mono'] font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 tracking-tighter"
           >
             PRODUITS LIVE
           </motion.h2>
        </div>

        {/* Filters Glass Track */}
        <div className="flex justify-center mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-2 flex flex-wrap gap-2 justify-center rounded-full border border-white/60"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-full font-['JetBrains_Mono'] font-bold text-[10px] tracking-widest uppercase transition-all duration-300 ${
                  activeFilter === filter
                    ? 'glass-button shadow-md'
                    : 'bg-transparent text-slate-600 hover:text-blue-600 hover:bg-white/40'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>
        </div>

        {/* SaaS Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card flex flex-col p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 relative overflow-hidden"
            >
              {/* Subtle hover blob */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full filter blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Header Badges */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full border border-white/80">
                  <CheckCircle2 size={12} className={getStatusColor(project.status)} />
                  <span className="font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest text-slate-600 uppercase">
                    {project.status}
                  </span>
                </div>
                <div className="px-3 py-1 font-['JetBrains_Mono'] text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                  {project.vertical}
                </div>
              </div>

              {/* Logo & Info */}
              <div className="flex flex-col items-center gap-4 mb-6 text-center relative z-10">
                 <div className="w-24 h-24 glass-icon flex items-center justify-center text-5xl mb-2 group-hover:scale-110 transition-transform duration-500">
                   {project.logo}
                 </div>
                 <h3 className="font-['JetBrains_Mono'] text-2xl font-black text-slate-800 tracking-wide">
                   {project.title}
                 </h3>
              </div>

              <p className="font-['Inter'] text-sm text-slate-600 mb-8 flex-1 text-center font-medium relative z-10">
                {project.tagline}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-3 justify-center mb-8 relative z-10">
                {project.stack.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 glass-card bg-white/50 rounded-lg text-[9px] font-bold tracking-widest font-['JetBrains_Mono'] text-slate-600 border border-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Results & Link */}
              <div className="glass-card bg-white/40 p-5 mb-6 rounded-2xl flex flex-col gap-3 relative z-10 border border-white/60">
                <span className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest text-slate-500 mb-2 border-b border-slate-300/50 pb-2 text-center">RÉSULTATS CLÉS</span>
                {Object.entries(project.metrics).filter(([_,v]) => v).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-xs px-2">
                    <span className="text-slate-600 font-bold font-['Inter'] capitalize">{key}</span>
                    <span className="text-blue-600 font-['JetBrains_Mono'] font-black">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-auto relative z-10">
                <Link
                  to={`/saas/${project.slug}`}
                  className="flex-1 glass-button py-4 transition-all font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase text-center w-full block hover:shadow-lg hover:shadow-blue-500/20"
                >
                  Case Study
                </Link>
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    className="flex-1 glass-card hover:bg-white/70 py-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-slate-600 uppercase transition-colors"
                  >
                    Démo <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
