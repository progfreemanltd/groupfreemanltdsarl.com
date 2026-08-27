import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { useCMS } from '../context/CMSContext';

export function BlogPage() {
  const { blogArticlesList } = useCMS();

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
            Blog & <span className="text-[#1A2CB5]">Actualités</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Perspectives, tendances et retours d'expertises de nos 6 pôles transversaux.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogArticlesList.map((article, idx) => (
               <motion.article 
                 key={article.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: idx * 0.1 }}
                 viewport={{ once: true, margin: "-50px" }}
                 className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
               >
                 <div className="h-48 w-full bg-gray-100 relative overflow-hidden" style={{ backgroundColor: `${article.color}10` }}>
                    {/* Placeholder image abstraction */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                      <ArrowUpRight className="w-12 h-12 text-black/50" />
                    </div>
                 </div>
                 <div className="p-8 flex flex-col flex-1">
                   <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider mb-4">
                     <span className="bg-white/50 px-3 py-1 rounded-full border" style={{ color: article.color, borderColor: `${article.color}30` }}>
                       {article.category}
                     </span>
                   </div>
                   
                   <h2 className="text-xl font-bold text-black mb-3 group-hover:text-[#1A2CB5] transition-colors leading-tight">
                     {article.title}
                   </h2>
                   
                   <p className="text-gray-500 mb-6 text-sm flex-1 leading-relaxed">
                     {article.desc}
                   </p>
                   
                   <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-t border-gray-50 pt-4 mt-auto">
                     <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4" />
                       {article.date}
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       {article.readTime} lecture
                     </div>
                   </div>
                 </div>
               </motion.article>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-6">Restez informé de nos actualités</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Inscrivez-vous à la newsletter Freeman Group pour recevoir nos analyses sectorielles et nouveautés.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
             <input type="email" placeholder="Votre adresse e-mail" className="flex-1 rounded-full px-6 py-4 bg-white/10 text-white border border-white/20 focus:outline-none focus:border-[#1A2CB5]" />
             <button type="submit" className="px-8 py-4 bg-[#1A2CB5] text-white rounded-full font-bold hover:bg-[#152391] transition-colors">
               S'inscrire
             </button>
          </form>
        </div>
      </section>

    </div>
  );
}
