import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { teamMembers } from '../data/team';
import { Linkedin, Github, Twitter, Plane, Wifi, Bluetooth, Settings, MapPin, Search, ChevronRight, Menu } from 'lucide-react';

export function TeamSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-16 pt-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-2 mb-6 shadow-sm border border-white/80"
          >
            <Settings className="w-4 h-4 text-emerald-500" />
            <span className="font-['JetBrains_Mono'] text-xs text-slate-600 font-bold tracking-widest uppercase">
              NOTRE ÉQUIPE
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['JetBrains_Mono'] text-4xl sm:text-5xl lg:text-6xl font-black text-slate-800 mb-4 tracking-tighter"
          >
            L'ÉQUIPE <span className="text-gradient">FREEMAN</span>
          </motion.h2>
        </div>

        {/* Custom Glass Tab System */}
        <div className="flex justify-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-panel p-2 flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/30"
          >
            {teamMembers.map((member, idx) => (
              <button
                key={member.id}
                onClick={() => setActiveTab(idx)}
                className={`px-6 py-3 rounded-full font-['JetBrains_Mono'] text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                  activeTab === idx 
                    ? 'glass-button shadow-md' 
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-white/40'
                }`}
              >
                {member.name.split(' ')[0]}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="w-full relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mx-auto"
            >
              <TeamMemberWidget member={teamMembers[activeTab]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function TeamMemberWidget({ member }: { member: any }) {
  const imageDisplay = member.name.includes("Charles Lebon") ? (
    <div className="w-full aspect-square rounded-full object-cover border border-white/80 bg-gradient-to-br from-white/60 to-white/20 mb-6 flex items-center justify-center text-7xl font-bold text-emerald-600 shadow-inner backdrop-blur-md">CL</div>
  ) : (
    <img
      src={member.image}
      alt={member.name}
      className="w-full aspect-square rounded-full object-cover glass-card border-4 border-white/80 mb-6 p-2 bg-white/40"
    />
  );

  return (
    <>
      {/* LEFT COLUMN: Tools & Search Widget */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="glass-panel p-6 flex flex-col items-center justify-center gap-8 h-full border border-white/60">
          <div className="w-16 h-16 glass-icon cursor-pointer bg-white/50 hover:bg-white/80">
            <Menu className="text-slate-600" size={24} />
          </div>
          <div className="w-16 h-16 glass-icon cursor-pointer bg-white/50 hover:bg-white/80 text-emerald-500">
            <Search className="text-emerald-500" size={24} />
          </div>
          <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center cursor-pointer relative p-2 border border-white/80">
            <div className="absolute inset-0 m-auto w-10 h-10 glass-button rounded-full flex items-center justify-center shadow-md bg-emerald-500/80 hover:bg-emerald-600">
              <span className="text-white font-bold text-xs">GO</span>
            </div>
          </div>
          <div className="w-16 h-16 glass-icon cursor-pointer bg-white/50 hover:bg-white/80">
            <MapPin className="text-slate-600" size={24} />
          </div>
        </div>
      </div>

      {/* CENTER MAIN COLUMN: Profile Details */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel p-8 md:p-10 flex flex-col items-center justify-center text-center relative h-full border border-white/60 shadow-lg shadow-emerald-900/5">
          
          <div className="absolute top-8 left-8 glass-card bg-white/60 px-4 py-2 rounded-full border border-white/80">
            <span className="text-[10px] font-bold tracking-widest text-emerald-700 uppercase">{member.role}</span>
          </div>

          <div className="w-48 h-48 mx-auto mt-8 relative group">
            <div className="absolute inset-[-10px] rounded-full bg-emerald-300/20 blur-xl transition-transform group-hover:scale-110 duration-500 z-0" />
            <div className="absolute inset-[0px] rounded-full glass-card border border-white/60 z-10" />
            <div className="absolute inset-[10px] z-20">
               {imageDisplay}
            </div>
          </div>

          <h3 className="font-['JetBrains_Mono'] text-3xl font-black text-slate-800 mt-8 mb-2 z-10 relative">
            {member.name}
          </h3>
          <p className="font-['Inter'] text-sm text-slate-600 max-w-sm mx-auto mb-8 line-clamp-3 font-medium z-10 relative">
            {member.bio}
          </p>

          <div className="flex gap-4 mb-4 z-10 relative">
            <a href={member.social.linkedin} className="w-12 h-12 glass-icon bg-white/60 hover:bg-white transition-all text-blue-600 border border-white/80 shadow-sm">
               <Linkedin size={20} />
            </a>
            <a href={member.social.github} className="w-12 h-12 glass-icon bg-white/60 hover:bg-white transition-all text-slate-800 border border-white/80 shadow-sm">
               <Github size={20} />
            </a>
            <a href={member.social.twitter} className="w-12 h-12 glass-icon bg-white/60 hover:bg-white transition-all text-sky-500 border border-white/80 shadow-sm">
               <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Nested Widgets */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Toggle Widget */}
        <div className="glass-panel p-6 flex flex-col gap-6 h-1/2 justify-between border border-white/60">
           <div className="flex items-center justify-between">
             <span className="font-['JetBrains_Mono'] text-xs font-bold text-slate-500 tracking-widest">CONNECTIVITY</span>
           </div>
           
           <div className="grid grid-cols-3 gap-4 h-full items-center">
              <div className="glass-card bg-white/40 border-white/80 rounded-2xl flex flex-col items-center justify-center py-6 cursor-pointer hover:bg-white/70 transition-colors relative group">
                 <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                 <Wifi size={24} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                 <span className="text-[9px] font-bold text-slate-600 mt-2">WIFI</span>
              </div>
              <div className="glass-card-interactive bg-transparent border-transparent hover:bg-white/40 border-white/60 rounded-2xl flex flex-col items-center justify-center py-6 cursor-pointer text-slate-500 hover:text-blue-500">
                 <Bluetooth size={24} className="mb-2" />
                 <span className="text-[9px] font-bold mt-2">BLUETOOTH</span>
              </div>
              <div className="glass-card-interactive bg-transparent border-transparent hover:bg-white/40 border-white/60 rounded-2xl flex flex-col items-center justify-center py-6 cursor-pointer text-slate-500 hover:text-amber-500">
                 <Plane size={24} className="mb-2" />
                 <span className="text-[9px] font-bold mt-2">AIRPLANE</span>
              </div>
           </div>
        </div>

        {/* Info Box Widget */}
        <div className="glass-panel p-6 flex flex-col h-1/2 justify-between border border-white/60">
           <span className="font-['JetBrains_Mono'] text-xs font-bold text-slate-500 tracking-widest mb-4">EXPERTISE</span>
           <div className="grid grid-cols-2 gap-4 flex-1">
              {member.skills.slice(0,4).map((skill: string) => (
                <div key={skill} className="glass-card bg-white/50 border border-white/80 rounded-xl flex items-center justify-center p-2 text-center">
                  <span className="font-['JetBrains_Mono'] text-[10px] font-bold text-slate-700 line-clamp-1">{skill}</span>
                </div>
              ))}
           </div>
           <button className="glass-button w-full py-4 rounded-xl mt-6 flex items-center justify-center gap-2 font-['JetBrains_Mono'] text-xs font-bold tracking-widest shadow-md">
             CONTacter <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </>
  );
}
