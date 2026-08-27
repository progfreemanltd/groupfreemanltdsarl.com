import { motion } from 'motion/react';
import { ArrowRight, TrendingUp, Building2, MapPin, Target, Clock, CheckCircle2, Users } from 'lucide-react';
import { Link } from 'react-router';

const investments = [
  {
    id: 'eco-resort',
    title: 'Eco-Resort Les Calanques',
    sector: 'Hôtellerie / BTP',
    status: 'En Développement',
    statusColor: 'text-amber-600',
    statusBg: 'bg-amber-50',
    desc: 'Acquisition foncière et construction d\'un complexe hôtelier 5 étoiles neutre en carbone, destiné à une clientèle internationale premium.',
    location: 'Marseille, France',
    kpis: [
      { label: 'Budget Global', value: '45M €', icon: Target },
      { label: 'ROI Estimé (IRR)', value: '14.5%', icon: TrendingUp },
      { label: 'Livraison', value: 'Q4 2027', icon: Clock }
    ]
  },
  {
    id: 'retail-park',
    title: 'Grand Paris Retail Park',
    sector: 'Commerce / Aménagement',
    status: 'Livré & En Exploitation',
    statusColor: 'text-emerald-600',
    statusBg: 'bg-emerald-50',
    desc: 'Restructuration complète d\'une ancienne zone industrielle en un retail park moderne, intégrant 35 enseignes nationales.',
    location: 'Île-de-France',
    kpis: [
      { label: 'Valorisation', value: '120M €', icon: Target },
      { label: 'Taux d\'Occupation', value: '98%', icon: CheckCircle2 },
      { label: 'Surface (GLA)', value: '45 000 m²', icon: Building2 }
    ]
  },
  {
    id: 'tech-hub',
    title: 'Digital Innovation Hub',
    sector: 'Digital / Aménagement',
    status: 'Levée de Fonds (Série A)',
    statusColor: 'text-[#1A2CB5]',
    statusBg: 'bg-blue-50',
    desc: 'Création d\'un incubateur/coworking de 5000m² adossé à un fonds d\'amorçage pour startups deeptech et IA.',
    location: 'Lyon, France',
    kpis: [
      { label: 'Ticket Minimum', value: '500K €', icon: Target },
      { label: 'Multiple Visé', value: 'x3 à 5 ans', icon: TrendingUp },
      { label: 'Capacité', value: '400 postes', icon: Users }
    ]
  },
  {
    id: 'logistics',
    title: 'Logis-Tech Center',
    sector: 'BTP / Management',
    status: 'Permis Obtenu',
    statusColor: 'text-purple-600',
    statusBg: 'bg-purple-50',
    desc: 'Construction d\'une plateforme logistique XXL 100% automatisée (robotisation AI) pour un leader du e-commerce.',
    location: 'Axe Lille-Paris',
    kpis: [
      { label: 'Investissement', value: '85M €', icon: Target },
      { label: 'Avancement', value: 'Phase 2/4', icon: Clock },
      { label: 'Empreinte Carbone', value: 'Net Zéro', icon: CheckCircle2 }
    ]
  }
];

export function InvestmentsPage() {
  return (
    <div className="flex flex-col w-full bg-[#f8f9fa] font-['Inter'] min-h-screen">
      
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-6"
          >
            Projets & <span className="text-[#1A2CB5]">Investissement</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Opportunités d'investissement et projets d'envergure pilotés par les sociétés du groupe Freeman.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-16">
            {investments.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row hover:shadow-xl transition-shadow duration-300"
              >
                {/* Visual Placeholder */}
                <div className="w-full lg:w-2/5 min-h-[300px] bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-gray-400" />
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-sm ${project.statusBg} ${project.statusColor}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 bg-current`} />
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12 w-full lg:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    <MapPin className="w-4 h-4" />
                    {project.location} • {project.sector}
                  </div>
                  
                  <h2 className="text-3xl font-bold text-black mb-4">{project.title}</h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed mb-10">
                    {project.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {project.kpis.map((kpi, kpiIdx) => (
                      <div key={kpiIdx} className="bg-[#f8f9fa] p-5 rounded-2xl border border-gray-50">
                        <kpi.icon className="w-6 h-6 text-[#1A2CB5] mb-3" />
                        <div className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</div>
                        <div className="text-xl font-bold text-black">{kpi.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link to="/contact" className="inline-flex items-center text-[#1A2CB5] font-bold text-lg group">
                      Demander le dossier partenaire
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Global */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-black mb-6">Un projet d'envergure en tête ?</h2>
          <p className="text-lg text-gray-500 mb-8">
            Notre holding structure, finance et exécute les projets les plus ambitieux. Rencontrons-nous pour en discuter.
          </p>
          <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors">
            Prendre rendez-vous avec un Associé
          </Link>
        </div>
      </section>

    </div>
  );
}
