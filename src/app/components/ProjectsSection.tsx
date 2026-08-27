import { motion } from 'motion/react';
import { Code2, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    client: 'Retail Tech',
    description: 'Plateforme e-commerce complète avec paiements, gestion de stock et analytics temps réel',
    stack: ['Next.js', 'Stripe', 'PostgreSQL', 'Vercel'],
    result: '€50k+ revenue M1',
    icon: '🛒'
  },
  {
    id: 2,
    title: 'IA Content Generator',
    client: 'Marketing Agency',
    description: 'Générateur de contenu marketing alimenté par GPT-4 avec templates personnalisables',
    stack: ['React', 'OpenAI', 'Python', 'AWS'],
    result: '500+ utilisateurs',
    icon: '✨'
  },
  {
    id: 3,
    title: 'Mobile Fitness App',
    client: 'Health & Wellness',
    description: 'Application mobile de coaching sportif avec suivi personnalisé et communauté',
    stack: ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
    result: '10k+ downloads',
    icon: '💪'
  },
  {
    id: 4,
    title: 'CRM Custom',
    client: 'B2B SaaS',
    description: 'CRM sur mesure avec automation des ventes et intégration email/calendar',
    stack: ['Vue.js', 'Laravel', 'MySQL', 'SendGrid'],
    result: '+40% conversions',
    icon: '📊'
  },
  {
    id: 5,
    title: 'Property Management',
    client: 'Real Estate',
    description: 'Plateforme de gestion immobilière avec visites virtuelles et signatures électroniques',
    stack: ['Angular', 'Django', 'PostgreSQL', 'AWS'],
    result: '200+ properties',
    icon: '🏠'
  }
];

export function ProjectsSection() {
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
            <Code2 className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.3em] font-bold text-slate-600">PROJETS CLIENTS</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['JetBrains_Mono'] font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 tracking-tighter"
          >
            RÉALISATIONS
          </motion.h2>
        </div>

        {/* Projects Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card flex flex-col p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 relative overflow-hidden"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-emerald-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-16 h-16 glass-icon group-hover:scale-110 transition-transform flex items-center justify-center text-4xl shadow-inner border border-white/80">
                  {project.icon}
                </div>
                <div className="glass-card px-3 py-1.5 rounded-full border border-white/80 bg-white/50">
                  <span className="text-slate-600 font-bold font-['JetBrains_Mono'] text-[9px] tracking-widest uppercase">
                    {project.client}
                  </span>
                </div>
              </div>

              <h3 className="font-['JetBrains_Mono'] text-xl font-black text-slate-800 tracking-wide mb-3 group-hover:text-blue-600 transition-colors relative z-10">
                {project.title}
              </h3>
              
              <p className="font-['Inter'] text-sm text-slate-600 mb-6 flex-1 font-medium relative z-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 glass-card bg-white/60 border border-white/80 rounded-md text-[9px] font-bold tracking-widest font-['JetBrains_Mono'] text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="glass-card bg-white/40 p-5 flex items-center justify-between rounded-2xl group/result cursor-pointer hover:bg-white/70 transition-all border border-white/60 relative z-10">
                <div className="flex flex-col">
                  <span className="text-slate-500 font-bold font-['JetBrains_Mono'] text-[10px] tracking-widest mb-1">IMPACT</span>
                  <span className="text-blue-600 font-['JetBrains_Mono'] font-black text-sm">{project.result}</span>
                </div>
                <div className="w-10 h-10 rounded-full glass-icon flex items-center justify-center group-hover/result:scale-110 group-hover/result:bg-blue-500 group-hover/result:text-white transition-all text-blue-500 border border-white/80">
                   <ExternalLink size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
