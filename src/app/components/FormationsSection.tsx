import { useState } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Clock, Users, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { useCMS } from '../context/CMSContext';

type LevelFilter = 'Tous' | 'Débutant' | 'Intermédiaire' | 'Avancé';
type ThemeFilter = 'Tous' | 'Web' | 'IA' | 'SaaS' | 'Growth';

export function FormationsSection() {
  const { formationsList } = useCMS();
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('Tous');
  const [themeFilter, setThemeFilter] = useState<ThemeFilter>('Tous');

  const filteredFormations = formationsList.filter(formation => {
    const levelMatch = levelFilter === 'Tous' || formation.level === levelFilter;
    const themeMatch = themeFilter === 'Tous' || formation.theme === themeFilter;
    return levelMatch && themeMatch;
  });

  const totalStudents = formationsList.reduce((sum, f) => sum + Number(f.students || 0), 0);
  const averageRating = formationsList.length > 0 
    ? (formationsList.reduce((sum, f) => sum + Number(f.rating || 0), 0) / formationsList.length).toFixed(1)
    : '4.8';

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center mb-16 text-center pt-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card px-6 py-2 mb-6 rounded-full inline-flex items-center shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-purple-600 mr-2" />
            <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.3em] font-bold text-slate-600">ACADEMY</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['JetBrains_Mono'] font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 tracking-tighter mb-12"
          >
            FORMATIONS
          </motion.h2>

          <div className="flex flex-wrap items-center justify-center gap-8">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="glass-panel px-8 py-5 flex items-center gap-5 rounded-3xl group cursor-default shadow-sm border border-white/80"
             >
                <div className="glass-icon w-14 h-14 rounded-full group-hover:scale-110 transition-transform bg-white/50">
                   <Users size={24} className="text-blue-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-slate-800 font-['JetBrains_Mono'] text-2xl font-black leading-none">{totalStudents.toLocaleString()}+</span>
                  <span className="text-slate-500 font-bold font-['JetBrains_Mono'] text-[10px] tracking-widest mt-1">APPRENANTS</span>
                </div>
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ delay: 0.2 }}
               className="glass-panel px-8 py-5 flex items-center gap-5 rounded-3xl group cursor-default shadow-sm border border-white/80"
             >
                <div className="glass-icon w-14 h-14 rounded-full group-hover:scale-110 transition-transform bg-white/50">
                   <Star size={24} className="text-amber-500 fill-amber-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-slate-800 font-['JetBrains_Mono'] text-2xl font-black leading-none">{averageRating}</span>
                  <span className="text-slate-500 font-bold font-['JetBrains_Mono'] text-[10px] tracking-widest mt-1">NOTE MOYENNE</span>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-16 relative z-20">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-panel p-2 flex flex-wrap gap-2 items-center rounded-full border border-white/60 shadow-sm bg-white/30"
           >
              <span className="text-[10px] font-bold text-slate-500 font-['JetBrains_Mono'] tracking-widest mx-4">LEVEL</span>
              {(['Tous', 'Débutant', 'Intermédiaire', 'Avancé'] as LevelFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLevelFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-['JetBrains_Mono'] font-bold text-[10px] tracking-widest uppercase transition-all duration-300 ${
                    levelFilter === filter
                      ? 'glass-button shadow-md'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-white/40'
                  }`}
                >
                  {filter}
                </button>
              ))}
           </motion.div>
           
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="glass-panel p-2 flex flex-wrap gap-2 items-center rounded-full border border-white/60 shadow-sm bg-white/30"
           >
              <span className="text-[10px] font-bold text-slate-500 font-['JetBrains_Mono'] tracking-widest mx-4">TOPIC</span>
              {(['Tous', 'Web', 'IA', 'SaaS', 'Growth'] as ThemeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setThemeFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-['JetBrains_Mono'] font-bold text-[10px] tracking-widest uppercase transition-all duration-300 ${
                    themeFilter === filter
                      ? 'glass-button shadow-md bg-purple-500/80 hover:bg-purple-600'
                      : 'text-slate-600 hover:text-purple-600 hover:bg-white/40'
                  }`}
                >
                  {filter}
                </button>
              ))}
           </motion.div>
        </div>

        {/* Formations Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {filteredFormations.map((formation, index) => (
            <motion.div
              key={formation.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={`/formations/${formation.slug}`}>
                <div className="glass-card-interactive h-full flex flex-col group overflow-hidden border border-white/60">
                  <div className="h-48 glass-panel border-0 border-b border-white/40 rounded-t-2xl rounded-b-none flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-white/40 to-white/10">
                     <div className="absolute inset-0 bg-blue-100/20 group-hover:bg-purple-200/20 transition-colors duration-500" />
                     <div className="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10 drop-shadow-sm">{formation.image}</div>
                     
                     <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-full border border-white/80 bg-white/60">
                       <span className={`font-['JetBrains_Mono'] font-bold text-[9px] tracking-widest uppercase text-slate-600`}>
                         {formation.level}
                       </span>
                     </div>
                     <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full border border-white/80 bg-white/60">
                       <span className="font-['JetBrains_Mono'] font-bold text-[9px] tracking-widest uppercase text-slate-600">
                         {formation.theme}
                       </span>
                     </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1 relative z-10">
                    <h3 className="font-['JetBrains_Mono'] text-xl font-black text-slate-800 mb-4 group-hover:text-purple-600 transition-colors">
                      {formation.title}
                    </h3>

                    <p className="font-['Inter'] text-sm text-slate-600 mb-8 flex-1 font-medium line-clamp-3">
                      {formation.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                       <div className="glass-card bg-white/40 border border-white/60 p-3 flex flex-col items-center justify-center rounded-xl group-hover:bg-white/60 transition-colors">
                         <Clock size={16} className="text-blue-500 mb-2" />
                         <span className="text-[10px] text-slate-600 font-bold font-['JetBrains_Mono']">{formation.duration}</span>
                       </div>
                       <div className="glass-card bg-white/40 border border-white/60 p-3 flex flex-col items-center justify-center rounded-xl group-hover:bg-white/60 transition-colors">
                         <Users size={16} className="text-emerald-500 mb-2" />
                         <span className="text-[10px] text-slate-600 font-bold font-['JetBrains_Mono']">{formation.students}+</span>
                       </div>
                       <div className="glass-card bg-white/40 border border-white/60 p-3 flex flex-col items-center justify-center rounded-xl group-hover:bg-white/60 transition-colors">
                         <Star size={16} className="text-amber-500 mb-2 fill-amber-500" />
                         <span className="text-[10px] text-slate-600 font-bold font-['JetBrains_Mono']">{formation.rating}</span>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/40">
                      <div className="font-['JetBrains_Mono'] text-2xl font-black text-slate-800 px-2 drop-shadow-sm">
                        €{formation.price}
                      </div>
                      <div className="glass-button px-6 py-3 rounded-xl flex items-center gap-2">
                         <BookOpen size={16} className="text-white" />
                         <span className="text-[10px] font-bold text-white tracking-widest uppercase">Voir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
