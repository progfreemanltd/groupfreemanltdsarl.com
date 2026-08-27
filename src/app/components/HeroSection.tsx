import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router'; 

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90svh] flex items-center justify-center overflow-hidden pt-12 pb-12"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-8">
          
          {/* Main Content Info */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-3 glass-card px-5 py-2.5 rounded-full self-start shadow-sm border-white/60"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="font-['JetBrains_Mono'] text-xs font-bold text-slate-600 tracking-wider">
                DISPONIBLE POUR DE NOUVEAUX PROJETS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-800 tracking-tighter leading-[1.05]"
            >
              DIGITAL<br />
              <span className="text-gradient drop-shadow-sm">CRAFT.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="font-['Inter'] text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium"
            >
              Conception et développement d'applications sur-mesure avec une approche Liquid Glass. L'élégance naturelle, claire et fluide au service de vos produits.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <Link 
                to="/contact"
                className="glass-button px-8 py-4 flex items-center gap-3 font-['JetBrains_Mono'] font-bold tracking-widest text-sm"
              >
                DÉMARRER <ArrowRight size={18} />
              </Link>
              
              <Link 
                to="/projects"
                className="glass-card-interactive px-8 py-4 flex items-center gap-3 font-['JetBrains_Mono'] font-bold tracking-widest text-sm text-slate-600"
              >
                PORTFOLIO
              </Link>
            </motion.div>
            
            {/* Soft UI Mini Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-slate-300/30"
            >
              {[
                { number: '50+', label: 'PROJETS' },
                { number: '10k', label: 'USERS' },
                { number: '99%', label: 'UPTIME' },
                { number: '24/7', label: 'SUPPORT' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col glass-card p-4 rounded-2xl items-center text-center shadow-sm">
                  <span className="font-['JetBrains_Mono'] font-black text-2xl text-blue-600 drop-shadow-sm">{stat.number}</span>
                  <span className="text-[10px] font-bold tracking-widest text-slate-500 mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Side: Glassmorphic UI Showcase Widgets */}
          <div className="lg:col-span-5 relative h-full min-h-[500px] w-full mt-12 lg:mt-0 animate-float">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 10, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
              className="absolute inset-0 glass-panel p-8 flex flex-col justify-between"
            >
              {/* Top Slider Widget */}
              <div className="glass-card p-6 rounded-3xl mb-8 flex flex-col gap-6 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="flex justify-between items-center px-2 relative z-10">
                   <span className="text-xs font-bold text-slate-600 tracking-widest">PERFORMANCE</span>
                   <span className="text-xs font-bold text-blue-600">98%</span>
                 </div>
                 <div className="h-4 bg-white/40 rounded-full relative mx-2 shadow-inner border border-white/60">
                    <div className="absolute left-0 top-0 bottom-0 w-[98%] bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                    <div className="absolute left-[98%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 glass-icon z-10 cursor-pointer hover:scale-110 transition-transform">
                       <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    </div>
                 </div>
              </div>

              {/* Toggles & Interactive Box */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="glass-card p-6 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-8 bg-blue-100/50 rounded-full relative cursor-pointer border border-white/60 shadow-inner">
                       <div className="absolute right-1 top-1 w-6 h-6 bg-blue-500 rounded-full shadow-md flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-white/40 to-transparent" />
                       </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Fluid Mode</span>
                 </div>

                 <div className="glass-card-interactive p-6 flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 glass-icon flex items-center justify-center">
                       <Sparkles size={20} className="text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Magic</span>
                 </div>
              </div>

              {/* Stacked Options */}
              <div className="glass-card p-3 flex flex-col gap-2">
                 {['Design System', 'React Flow', 'API GraphQL'].map((item, idx) => (
                   <div key={item} className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${idx === 0 ? 'bg-white/60 border border-white/80 shadow-sm' : 'hover:bg-white/40 border border-transparent'}`}>
                      <span className={`font-['JetBrains_Mono'] text-xs font-bold ${idx === 0 ? 'text-blue-600' : 'text-slate-600'}`}>{item}</span>
                      <MousePointer2 size={14} className={idx === 0 ? 'text-blue-600' : 'text-slate-400'} />
                   </div>
                 ))}
              </div>

            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
