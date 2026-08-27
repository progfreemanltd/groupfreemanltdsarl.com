import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const categories = ['Tous', 'Digital', 'BTP', 'Management', 'Hôtellerie', 'Aménagement', 'Commerce'];

const projects = [
  { id: 1, title: 'Tour Horizon', category: 'BTP', desc: 'Construction d\'une tour de bureaux éco-responsable de 45 étages.', imgColor: '#ea580c' },
  { id: 2, title: 'Retail OS', category: 'Digital', desc: 'Plateforme unifiée de gestion de caisse et de stock pour le retail.', imgColor: '#1A2CB5' },
  { id: 3, title: 'Hôtel Le Rivage', category: 'Hôtellerie', desc: 'Rénovation complète et repositionnement d\'un établissement 5 étoiles.', imgColor: '#b91c1c' },
  { id: 4, title: 'Fusion G&K', category: 'Management', desc: 'Accompagnement du top management lors d\'une fusion internationale.', imgColor: '#047857' },
  { id: 5, title: 'Boutiques Flagship', category: 'Commerce', desc: 'Déploiement d\'un réseau de 15 boutiques premium en Europe.', imgColor: '#0369a1' },
  { id: 6, title: 'Campus Innovation', category: 'Aménagement', desc: 'Space planning pour un campus d\'innovation de 10 000m².', imgColor: '#6d28d9' },
  { id: 7, title: 'AI Logistics', category: 'Digital', desc: 'Optimisation de la supply chain par l\'intelligence artificielle.', imgColor: '#1A2CB5' },
  { id: 8, title: 'Éco-quartier Sud', category: 'BTP', desc: 'Promotion et aménagement d\'un quartier à énergie positive.', imgColor: '#ea580c' },
];

export function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filteredProjects = activeCategory === 'Tous' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="flex flex-col w-full bg-white font-['Inter'] min-h-screen">
      
      {/* Header */}
      <section className="bg-[#f8f9fa] pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-6"
          >
            Nos <span className="text-[#1A2CB5]">Réalisations</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Découvrez une sélection de projets majeurs livrés par les différents pôles de Freeman Group.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-sm ${
                  activeCategory === cat 
                    ? 'bg-black text-white shadow-md' 
                    : 'bg-[#f8f9fa] text-gray-600 hover:bg-gray-200 border border-transparent hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group rounded-3xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="h-48 w-full relative overflow-hidden" style={{ backgroundColor: `${project.imgColor}15` }}>
                    {/* Placeholder for project image */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-70 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-2" style={{ backgroundColor: project.imgColor }}>
                        <span className="text-white font-black text-xl">{project.title.charAt(0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider" style={{ color: project.imgColor, backgroundColor: `${project.imgColor}10` }}>
                        {project.category}
                      </span>
                      <ArrowUpRight className="text-gray-400 group-hover:text-black transition-colors" size={20} />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-[#1A2CB5] transition-colors">{project.title}</h3>
                    <p className="text-gray-500 line-clamp-2">
                      {project.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-500 text-lg">Aucun projet trouvé pour cette catégorie pour le moment.</p>
              </div>
            )}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
