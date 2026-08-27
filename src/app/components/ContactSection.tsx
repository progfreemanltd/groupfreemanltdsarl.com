import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Calendar, MapPin, Linkedin, Github, Twitter, Send, User, ChevronDown, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCMS } from '../context/CMSContext';

interface ContactForm {
  firstName: string;
  email: string;
  requestType: string;
  message: string;
}

export function ContactSection() {
  const { contactData } = useCMS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form data:', data);
    toast.success('Message envoyé ! Nous vous répondrons dans les 24h.', {
      style: { background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.8)', color: '#1e293b', borderRadius: '1rem', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05)' }
    });
    reset();
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto z-10 pt-8">
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card px-6 py-2 mb-6 rounded-full inline-flex items-center shadow-sm"
          >
            <Mail className="w-4 h-4 text-blue-600 mr-2" />
            <span className="font-['JetBrains_Mono'] text-[10px] tracking-[0.3em] font-bold text-slate-600">GET IN TOUCH</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-['JetBrains_Mono'] font-black text-4xl md:text-5xl lg:text-6xl text-slate-800 tracking-tighter"
          >
            CONTACT
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Contact Form Glass Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 glass-panel p-8 md:p-12 border border-white/80"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest text-slate-500 mb-3 ml-2">PRÉNOM</label>
                  <div className="relative">
                    <User size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      {...register('firstName', { required: 'Prénom requis' })}
                      type="text"
                      className="w-full pl-14 pr-6 py-4 glass-card bg-white/40 border-white/60 focus:bg-white/60 focus:border-white font-['Inter'] text-slate-700 placeholder-slate-400 outline-none transition-all shadow-inner"
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <span className="text-[10px] text-red-500 mt-2 ml-2 font-['JetBrains_Mono'] font-bold">{errors.firstName.message}</span>}
                </div>

                <div>
                  <label className="block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest text-slate-500 mb-3 ml-2">EMAIL</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      {...register('email', {
                        required: 'Email requis',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' }
                      })}
                      type="email"
                      className="w-full pl-14 pr-6 py-4 glass-card bg-white/40 border-white/60 focus:bg-white/60 focus:border-white font-['Inter'] text-slate-700 placeholder-slate-400 outline-none transition-all shadow-inner"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-red-500 mt-2 ml-2 font-['JetBrains_Mono'] font-bold">{errors.email.message}</span>}
                </div>
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest text-slate-500 mb-3 ml-2">TYPE DE DEMANDE</label>
                <div className="relative">
                  <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    {...register('requestType', { required: 'Requis' })}
                    className="w-full pl-6 pr-14 py-4 glass-card bg-white/40 border-white/60 focus:bg-white/60 focus:border-white font-['Inter'] font-semibold text-slate-700 outline-none transition-all appearance-none shadow-inner"
                  >
                    <option value="" className="text-slate-500">Sélectionnez le sujet...</option>
                    <option value="webapp" className="text-slate-700">Développement Web App</option>
                    <option value="mobile" className="text-slate-700">Application Mobile</option>
                    <option value="ia" className="text-slate-700">Intégration IA</option>
                    <option value="saas" className="text-slate-700">Création SaaS</option>
                    <option value="formation" className="text-slate-700">Formation</option>
                    <option value="growth" className="text-slate-700">Growth Marketing</option>
                    <option value="autre" className="text-slate-700">Autre</option>
                  </select>
                </div>
                {errors.requestType && <span className="text-[10px] text-red-500 mt-2 ml-2 font-['JetBrains_Mono'] font-bold">{errors.requestType.message}</span>}
              </div>

              <div>
                <label className="block font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest text-slate-500 mb-3 ml-2">MESSAGE</label>
                <div className="relative">
                  <MessageSquare size={20} className="absolute left-5 top-6 text-slate-400" />
                  <textarea
                    {...register('message', { required: 'Message requis', minLength: { value: 20, message: 'Minimum 20 caractères' } })}
                    rows={5}
                    className="w-full pl-14 pr-6 py-5 glass-card bg-white/40 border-white/60 focus:bg-white/60 focus:border-white font-['Inter'] text-slate-700 placeholder-slate-400 outline-none transition-all resize-none shadow-inner"
                    placeholder="Dites-nous tout..."
                  />
                </div>
                {errors.message && <span className="text-[10px] text-red-500 mt-2 ml-2 font-['JetBrains_Mono'] font-bold">{errors.message.message}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full glass-button py-5 transition-all text-white font-['JetBrains_Mono'] font-bold tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-70 mt-6 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    TRANSMISSION...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    ENVOYER LE MESSAGE
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Details & Links Glass */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Direct Info */}
            <div className="glass-panel flex-1 p-8 md:p-10 flex flex-col justify-center border border-white/60">
              <h3 className="font-['JetBrains_Mono'] text-xs font-bold text-slate-500 tracking-widest mb-8">DIRECT CONTACT</h3>
              
              <a href={`mailto:${contactData.email || 'contact@freeman-ltd.com'}`} className="glass-card bg-white/40 p-5 flex items-center gap-6 mb-6 hover:bg-white/60 transition-all group rounded-2xl border border-white/80">
                <div className="w-12 h-12 rounded-full glass-icon flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={20} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="font-['JetBrains_Mono'] font-bold text-sm text-slate-700 group-hover:text-blue-600 transition-colors">{contactData.email || 'contact@freeman-ltd.com'}</span>
              </a>
              
              <div className="glass-card bg-white/40 p-5 flex items-center gap-6 rounded-2xl border border-white/80">
                <div className="w-12 h-12 rounded-full glass-icon flex items-center justify-center">
                  <MapPin size={20} className="text-slate-600" />
                </div>
                <span className="font-['JetBrains_Mono'] font-bold text-sm text-slate-700 whitespace-pre-line">{contactData.address || 'Marseille, France'}</span>
              </div>
            </div>

            {/* Calendly Widget */}
            <div className="glass-panel p-8 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group border border-white/60">
              <div className="absolute inset-0 bg-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-20 h-20 glass-card bg-white/50 border border-white/80 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 relative z-10">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-['JetBrains_Mono'] text-xl font-black text-slate-800 mb-3 relative z-10">APPEL DÉCOUVERTE</h3>
              <p className="font-['Inter'] text-sm font-medium text-slate-600 mb-8 relative z-10">Un échange gratuit de 30 min pour parler de vous.</p>
              <a
                href="https://calendly.com/freeman-ltd"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button px-8 py-4 font-['JetBrains_Mono'] text-[10px] font-bold tracking-widest uppercase transition-all shadow-md relative z-10"
              >
                RÉSERVER MAINTENANT
              </a>
            </div>

            {/* Social Links Row */}
            <div className="grid grid-cols-3 gap-6">
              <a href={contactData.linkedin || "#"} target="_blank" rel="noopener noreferrer" className="glass-card-interactive py-6 rounded-2xl flex items-center justify-center text-slate-600 hover:text-blue-600 transition-all border border-white/60 bg-white/30 hover:bg-white/60">
                <Linkedin size={24} />
              </a>
              <a href={contactData.github || "#"} target="_blank" rel="noopener noreferrer" className="glass-card-interactive py-6 rounded-2xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all border border-white/60 bg-white/30 hover:bg-white/60">
                <Github size={24} />
              </a>
              <a href={contactData.twitter || "#"} target="_blank" rel="noopener noreferrer" className="glass-card-interactive py-6 rounded-2xl flex items-center justify-center text-slate-600 hover:text-sky-500 transition-all border border-white/60 bg-white/30 hover:bg-white/60">
                <Twitter size={24} />
              </a>
            </div>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
