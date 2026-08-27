import { motion } from 'motion/react';
import { Building2, Milestone, Users, Scale } from 'lucide-react';
import { Link } from 'react-router';
import { useCMS } from '../context/CMSContext';

const timeline = [
  { year: '2020', title: 'Fondation Initiale', desc: 'Création des premières entités digitales avec une approche purement product-led et tech-centric.' },
  { year: '2022', title: 'Structuring des Process', desc: 'Mise en place de frameworks robustes pour escalader les livraisons SaaS et agences.' },
  { year: '2024', title: 'Diversification Stratégique', desc: 'Lancement des premières incursions dans les secteurs traditionnels pour digitaliser l\'économie classique.' },
  { year: '2026', title: 'Naissance de Freeman Group', desc: 'Consolidation des 6 pôles en une holding multi-secteurs sous la direction de 4 associés experts.' }
];

export function AboutPage() {
  const { teamMembersList } = useCMS();

  return (
    <div className="flex flex-col w-full bg-white font-['Inter']">
      
      {/* Header */}
      <section className="bg-[#f8f9fa] pt-32 pb-20 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-6"
          >
            Qui est <span className="text-[#1A2CB5]">Freeman Group</span> ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500"
          >
            Un conglomérat d'experts dédiés à la création de valeur dans 6 secteurs clés.
          </motion.p>
        </div>
      </section>

      {/* Présentation Juridique & Structure */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Scale className="w-8 h-8 text-[#1A2CB5]" />
                <h2 className="text-3xl font-bold text-black">Structure Juridique</h2>
              </div>
              <p className="text-gray-500 mb-6 leading-relaxed">
                <strong className="text-black">Freeman Limited</strong> (LTD) est une holding stratégique consolidant les activités de ses différentes filiales spécialisées. Cette structure nous permet de mutualiser nos ressources tout en maintenant une agilité extrême dans chaque secteur d'activité.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                En intégrant verticalement nos compétences (de la conception digitale à la construction physique), Freeman Group offre un niveau de contrôle qualité et d'optimisation des coûts inédit sur le marché. Nos filiales partagent le même ADN : l'innovation, la rigueur et la quête de l'excellence.
              </p>
              
              <ul className="space-y-4">
                {['Holding d\'investissement et de pilotage', 'Mutualisation des fonctions support (IT, RH, Finance)', 'Filiales 100% dédiées par secteur (BTP, Code, etc.)'].map((item, idx) => (
                   <li key={idx} className="flex items-center gap-3 text-black font-medium">
                     <div className="w-2 h-2 rounded-full bg-[#1A2CB5]" />
                     {item}
                   </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#f8f9fa] p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#1A2CB5]/5 rounded-full blur-3xl"></div>
               <h3 className="text-xl font-bold text-black mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
                 <span>Freeman Group (Holding)</span>
                 <Building2 className="text-gray-400" />
               </h3>
               
               <div className="grid grid-cols-2 gap-4">
                 {['Filiale Digital', 'Filiale BTP', 'Filiale Management', 'Filiale Hôtellerie', 'Filiale Aménagement', 'Filiale Commerce'].map((filiale) => (
                   <div key={filiale} className="bg-white px-4 py-3 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-100">
                     • {filiale}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frise Historique */}
      <section className="py-24 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-16 justify-center">
            <Milestone className="w-8 h-8 text-[#1A2CB5]" />
            <h2 className="text-3xl font-bold text-black text-center">Notre Histoire</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Ligne verticale */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 sm:-translate-x-1/2"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className={`relative flex flex-col sm:flex-row gap-8 ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Point */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full bg-[#1A2CB5] outline outline-4 outline-white sm:-translate-x-1/2 z-10 mt-1.5 sm:mt-0"></div>
                  
                  {/* Contenu (Moitié) */}
                  <div className={`pl-12 sm:pl-0 sm:w-1/2 flex flex-col ${index % 2 === 0 ? 'sm:pl-12 sm:items-start' : 'sm:pr-12 sm:items-end sm:text-right'}`}>
                    <span className="text-xl font-black text-[#1A2CB5] mb-2">{item.year}</span>
                    <h3 className="text-lg font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Équipe (Les 4 Associés) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 justify-center mb-4">
              <Users className="w-8 h-8 text-[#1A2CB5]" />
              <h2 className="text-3xl font-bold text-black">Les Associés & l'Équipe</h2>
            </div>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Aux commandes de Freeman Group, des esprits complémentaires qui unissent leurs forces pour diriger les différents pôles d'excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembersList.map((partner, idx) => (
              <motion.div
                key={partner.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-6 p-6 lg:p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl hover:border-[#1A2CB5]/30 transition-all group"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl bg-gray-200 overflow-hidden relative">
                  {partner.image ? (
                    <img src={partner.image} className="w-full h-full object-cover" alt={partner.name} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200 flex flex-col items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Photo</span>
                    </div>
                  )}
                  {/* Survol effet */}
                  <div className="absolute inset-0 bg-[#1A2CB5]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-black mb-1 group-hover:text-[#1A2CB5] transition-colors">{partner.name}</h3>
                  <p className="text-sm font-semibold text-[#1A2CB5] mb-3">{partner.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {partner.bio || partner.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="py-24 bg-[#1A2CB5]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white tracking-tight mb-6">Rejoignez-nous ou construisons ensemble</h2>
          <p className="text-xl text-white/80 mb-10">
            Vous souhaitez faire appel à l'un de nos pôles, ou nous proposer un partenariat inter-secteurs ?
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#1A2CB5] rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
            Nous Contacter
          </Link>
        </div>
      </section>

    </div>
  );
}

