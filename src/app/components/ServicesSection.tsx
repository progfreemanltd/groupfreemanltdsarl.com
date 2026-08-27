import { motion } from 'motion/react';
import { Code, Smartphone, Brain, Rocket, ArrowRight, Settings } from 'lucide-react';
import { Link } from 'react-router';

const services = [
  {
    icon: Code,
    title: 'DÉVELOPPEMENT WEB',
    description: 'Applications web sur mesure avec les dernières technologies (React, Next.js, Node.js)',
    features: ['Architecture scalable', 'UI/UX moderne', 'Performance optimale'],
    price: 'À partir de €5k',
    color: 'text-blue-500',
    bg: 'bg-blue-500'
  },
  {
    icon: Smartphone,
    title: 'APP MOBILE',
    description: 'Apps natives ou cross-platform pour iOS et Android avec React Native',
    features: ['Design natif', 'Offline-first', 'Push notifications'],
    price: 'À partir de €8k',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500'
  },
  {
    icon: Brain,
    title: 'INTÉGRATION IA',
    description: 'Intégration de l\'IA dans vos produits (GPT, Claude, ML custom)',
    features: ['LLM integration', 'Automation', 'Analytics IA'],
    price: 'À partir de €3k',
    color: 'text-purple-500',
    bg: 'bg-purple-500'
  },
  {
    icon: Rocket,
    title: 'CRÉATION SAAS',
    description: 'Conception, développement et lancement de votre SaaS en production',
    features: ['MVP en 6 semaines', 'Paiements récurrents', 'Analytics & CRM'],
    price: 'À partir de €15k',
    color: 'text-rose-500',
    bg: 'bg-rose-500'
  }
];

const processSteps = [
  { step: '01', title: 'BRIEF', description: 'Analyse et scope' },
  { step: '02', title: 'DESIGN', description: 'UI/UX & architecture' },
  { step: '03', title: 'CODE', description: 'Développement agile' },
  { step: '04', title: 'LAUNCH', description: 'Déploiement production' }
];

export function ServicesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Widget */}
        <div className="flex flex-col items-center justify-center mb-16 text-center pt-8">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-card px-6 py-2 mb-6 rounded-full inline-flex items-center shadow-sm"
           >
             <Settings className="w-4 h-4 text-blue-600 mr-2" />
             <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.3em] font-bold text-slate-600">SERVICES OVERVIEW</span>
           </motion.div>
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="font-['JetBrains_Mono'] font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 tracking-tighter"
           >
             NOS SERVICES
           </motion.h2>
        </div>

        {/* Services Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass-card-interactive flex flex-col p-8 group overflow-hidden relative"
            >
              {/* Subtle hover gradient background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-transparent to-${service.color.split('-')[1]}-500`} />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-16 h-16 glass-icon group-hover:scale-110 transition-all duration-300">
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <div className="glass-card px-3 py-1.5 rounded-full border border-white/80">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-slate-600 font-bold tracking-widest">{service.price}</span>
                </div>
              </div>

              <h3 className="font-['JetBrains_Mono'] text-2xl font-black text-slate-800 tracking-wider mb-3 group-hover:text-blue-600 transition-colors relative z-10">
                {service.title}
              </h3>
              
              <p className="font-['Inter'] text-sm text-slate-600 mb-6 flex-1 font-medium relative z-10">
                {service.description}
              </p>

              <div className="glass-card bg-white/40 p-5 mb-6 rounded-2xl relative z-10 border border-white/60">
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-xs text-slate-700 font-['JetBrains_Mono'] font-bold tracking-wide">
                      <div className={`w-2 h-2 ${service.bg} rounded-full shadow-[0_0_5px_currentColor]`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button className="flex items-center justify-between w-full p-4 glass-card hover:bg-white/70 transition-all group/btn rounded-2xl cursor-pointer relative z-10">
                 <span className="font-['JetBrains_Mono'] text-xs font-bold text-slate-600 tracking-widest uppercase group-hover/btn:text-blue-600">En savoir plus</span>
                 <ArrowRight className="w-4 h-4 text-blue-500 group-hover/btn:translate-x-1 group-hover/btn:scale-110 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Process Glass Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-12 mb-16 rounded-[2.5rem]"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="lg:w-1/4">
               <h3 className="font-['JetBrains_Mono'] text-3xl font-black text-slate-800 tracking-tighter mb-4 uppercase">
                 Methodologie Agile
               </h3>
               <p className="text-sm text-slate-600 leading-relaxed font-bold">
                 Un processus fluide et transparent pour une livraison rapide et qualitative.
               </p>
            </div>
            
            <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-6 lg:mt-0">
              {processSteps.map((step, idx) => (
                <div key={step.step} className="glass-card p-6 flex flex-col items-center text-center rounded-3xl group hover:scale-105 transition-all cursor-default">
                  <div className="text-4xl font-black text-blue-200 mb-4 font-['JetBrains_Mono'] group-hover:text-blue-500 transition-colors drop-shadow-sm">{step.step}</div>
                  <div className="font-['JetBrains_Mono'] text-xs text-slate-800 tracking-widest font-black mb-2">{step.title}</div>
                  <div className="text-[10px] font-bold text-slate-500 leading-tight block">{step.description}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center pt-8">
          <Link
            to="/contact"
            className="group glass-button px-10 py-5 font-['JetBrains_Mono'] text-white font-bold tracking-widest flex items-center gap-3 transition-all"
          >
            DISCUTER DE MON PROJET
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
