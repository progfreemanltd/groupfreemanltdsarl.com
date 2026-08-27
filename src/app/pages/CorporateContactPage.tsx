import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Calendar, ArrowRight, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useCMS } from '../context/CMSContext';

export function CorporateContactPage() {
  const { contactData } = useCMS();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data: any) => {
    console.log(data);
    alert('Demande de devis / contact envoyée avec succès ! (Simulation)');
  };

  return (
    <div className="flex flex-col w-full bg-[#f8f9fa] font-['Inter'] min-h-screen">
      
      {/* Header */}
      <section className="bg-white pt-32 pb-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-black tracking-tight mb-6"
          >
            Discutons de votre <span className="text-[#1A2CB5]">Projet</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            Saisissez l'opportunité de collaborer avec le groupe multi-secteurs de référence. Demandez un devis ou prenez rendez-vous.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Formulaire complet */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-black mb-8">Formulaire de demande</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Prénom & Nom</label>
                    <input 
                      {...register("name", { required: true })}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Entreprise</label>
                    <input 
                      {...register("company")}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email professionnel</label>
                    <input 
                      type="email"
                      {...register("email", { required: true })}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all"
                      placeholder="jean@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                    <input 
                      type="tel"
                      {...register("phone")}
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all"
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pôle concerné</label>
                  <select 
                    {...register("pole")}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all text-gray-700"
                  >
                    <option value="">Sélectionnez un pôle...</option>
                    <option value="digital">Digital & IA</option>
                    <option value="btp">BTP & Construction</option>
                    <option value="management">Management & Conseil</option>
                    <option value="hotellerie">Hôtellerie</option>
                    <option value="amenagement">Aménagement & Design</option>
                    <option value="commerce">Commerce & Retail</option>
                    <option value="multi">Projet Multi-secteurs</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Votre message / Besoins</label>
                  <textarea 
                    {...register("message", { required: true })}
                    rows={5}
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A2CB5] focus:border-transparent transition-all resize-none"
                    placeholder="Décrivez votre projet en quelques mots..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-[#1A2CB5] transition-colors shadow-lg shadow-black/5"
                >
                  Envoyer la demande
                </button>
              </form>
            </motion.div>

            {/* Infos Pratiques & Calendly */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-8"
            >
              {/* Infos Contact */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-bold text-black mb-6">Nos Coordonnées Corporate</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A2CB5]/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-[#1A2CB5]" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Siège Freeman Group LTD</p>
                      <p className="text-gray-500 whitespace-pre-line">{contactData.address || '2 Tour La Marseillaise\n13002 Marseille, FRANCE'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A2CB5]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#1A2CB5]" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Email Administratif & Presse</p>
                      <a href={`mailto:${contactData.email || 'contact@freeman-ltd.com'}`} className="text-gray-500 hover:text-[#1A2CB5] transition-colors">{contactData.email || 'contact@freeman-ltd.com'}</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1A2CB5]/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#1A2CB5]" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Ligne Entreprise</p>
                      <p className="text-gray-500">{contactData.phone || '+33 (0)4 91 00 00 00'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Widget Calendly Fake / Integration */}
              <div className="bg-gradient-to-br from-[#1A2CB5] to-[#0c1664] p-8 rounded-3xl shadow-xl shadow-[#1A2CB5]/20 text-white relative overflow-hidden flex-1 flex flex-col justify-center">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                
                <Calendar className="w-10 h-10 text-white/50 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Réserver un créneau Direct Associé</h3>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Pour les projets dépassant 50K€ d'investissement, vous avez la possibilité de réserver un appel direct de 30 min avec l'un des 4 associés du groupe.
                </p>
                <div className="mt-auto">
                  <a href="#" className="inline-flex items-center justify-center bg-white text-[#1A2CB5] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform w-full sm:w-auto">
                    Ouvrir Calendly
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </div>
              </div>

            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
}
