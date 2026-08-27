import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCMS } from '../context/CMSContext';

export function CorporateHomePage() {
  const { homepageData, saasProjectsList, formationsList } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = homepageData.heroImages || [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
  ];

  // Auto rotate background Hero slides
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Helper dynamically resolving Lucide icons from string name
  const getIcon = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    return IconComponent || LucideIcons.HelpCircle;
  };

  return (
    <div className="flex flex-col w-full bg-white font-['Inter'] overflow-x-hidden">
      
      {/* Hero Section with Background Slider */}
      <section className="relative px-4 pt-24 pb-24 sm:pt-32 sm:pb-28 lg:pb-36 overflow-hidden flex items-center justify-center min-h-[90vh]">
        {/* Slider Background images */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-gray-950">
          {slides.map((slide, index) => (
            <motion.div
              key={slide + index}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ 
                opacity: index === currentSlide ? 1 : 0,
                scale: index === currentSlide ? 1 : 1.05
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${slide}')` }}
            />
          ))}
          {/* Dark overlay for perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85 z-0" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-[#60a5fa] text-sm font-semibold tracking-wide mb-6 shadow-sm backdrop-blur-sm">
              {homepageData.heroBadge}
            </span>
            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-8 leading-[1.1] whitespace-pre-line drop-shadow-md">
              {homepageData.heroTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 font-medium max-w-3xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              {homepageData.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={homepageData.heroBtnPrimaryLink} className="px-8 py-4 bg-[#1A2CB5] text-white rounded-full font-semibold text-lg hover:bg-blue-600 hover:shadow-xl hover:shadow-[#1A2CB5]/30 transition-all w-full sm:w-auto text-center">
                {homepageData.heroBtnPrimaryText}
              </Link>
              <Link to={homepageData.heroBtnSecondaryLink} className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 hover:border-white transition-all w-full sm:w-auto text-center backdrop-blur-sm">
                {homepageData.heroBtnSecondaryText}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Page Sections Rendering Loop */}
      {(homepageData.visibleSections || []).map((sectionKey, orderIndex) => {
        
        // 1. SECTORS SECTION
        if (sectionKey === 'sectors') {
          return (
            <section key="sectors" className="py-24 bg-white relative z-10 border-t border-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-4">Nos 6 Pôles d'Expertise</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Une synergie de compétences dirigée par des experts reconnus dans leurs domaines respectifs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(homepageData.sectors || []).map((sector, idx) => {
                    const IconComponent = getIcon(sector.iconName);
                    return (
                      <motion.div
                        key={sector.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        viewport={{ once: true }}
                        className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1A2CB5]/20 transition-all duration-300"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#f8f9fa] group-hover:bg-[#1A2CB5]/10 flex items-center justify-center mb-6 transition-colors">
                          <IconComponent className="w-7 h-7 text-[#1A2CB5]" />
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-3">{sector.title}</h3>
                        <p className="text-gray-500 leading-relaxed mb-6">
                          {sector.description}
                        </p>
                        <Link to={sector.link} className="inline-flex items-center text-[#1A2CB5] font-semibold group/btn">
                          Découvrir
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 2. ABOUT ASSOCIATES TEASER
        if (sectionKey === 'about_teaser') {
          return (
            <section key="about_teaser" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-6">
                      {homepageData.aboutTitle}
                    </h2>
                    <p className="text-gray-500 text-lg leading-relaxed mb-6">
                      {homepageData.aboutTeaser1}
                    </p>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8">
                      {homepageData.aboutTeaser2}
                    </p>
                    <Link to={homepageData.aboutBtnLink} className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors">
                      {homepageData.aboutBtnText}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-gray-200 relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100 flex items-center justify-center">
                        <p className="text-gray-400 font-medium">Image Corporate (Bureaux/Équipe)</p>
                      </div>
                    </div>
                    
                    {/* Floating Stat Card */}
                    <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-[#1A2CB5]/10 flex items-center justify-center">
                          <LucideIcons.Users className="w-6 h-6 text-[#1A2CB5]" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-black">{homepageData.aboutStatNumber}</p>
                          <p className="text-gray-500 font-medium">{homepageData.aboutStatLabel}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        }

        // 3. SAAS PROJECTS SECTION
        if (sectionKey === 'saas') {
          return (
            <section key="saas" className="py-24 bg-white border-t border-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-4">Nos Applications SaaS</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg">Nos solutions de pointe prêtes à être déployées pour accélérer votre business.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {saasProjectsList.slice(0, 3).map((project, idx) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#1A2CB5]/15 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-4xl block mb-6">{project.logo}</span>
                        <h3 className="text-2xl font-bold text-black mb-1">{project.title}</h3>
                        <p className="text-xs text-blue-600 font-bold mb-4">{project.vertical}</p>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">{project.description}</p>
                      </div>
                      <Link to={`/boutique/${project.id}`} className="inline-flex items-center text-[#1A2CB5] font-semibold group/btn pt-4 border-t border-gray-50">
                        En savoir plus <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 4. FORMATIONS CATALOGUE SECTION
        if (sectionKey === 'formations') {
          return (
            <section key="formations" className="py-24 bg-[#f8f9fa] border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-4">Catalogue de Formations</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg">Montez en compétences avec nos programmes intensifs sur-mesure.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {formationsList.slice(0, 3).map((formation, idx) => (
                    <motion.div 
                      key={formation.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <span className="text-4xl">{formation.image || '🎓'}</span>
                          <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{formation.theme}</span>
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2">{formation.title}</h3>
                        <p className="text-xs text-gray-400 font-bold mb-4">Niveau : {formation.level} | Durée : {formation.duration}</p>
                        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">{formation.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <span className="text-lg font-black text-[#1A2CB5]">{formation.price} € HT</span>
                        <Link to={`/formations/${formation.slug}`} className="inline-flex items-center text-sm font-bold text-black hover:text-[#1A2CB5] transition-colors">Programme <ArrowRight className="w-4 h-4 ml-1" /></Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        // 5. INLINE MULTI-IMAGE SLIDER COMPONENT
        if (sectionKey === 'slider_carousel') {
          return (
            <section key="slider_carousel" className="py-24 bg-white border-t border-gray-100">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight mb-4">Galerie Freeman Group</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto text-lg">Nos réalisations, bureaux et chantiers à travers le monde.</p>
                </div>
                <div className="aspect-[21/9] rounded-3xl overflow-hidden relative shadow-lg bg-gray-950">
                  {/* Auto rotating slides */}
                  {slides.map((slide, idx) => (
                    <motion.div
                      key={'dyn-slide-' + idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: idx === currentSlide ? 1 : 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${slide}')` }}
                    />
                  ))}
                  {/* Indicator dots */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 6. QUICK CONTACT FORM ELEMENT
        if (sectionKey === 'contact_form') {
          return (
            <section key="contact_form" className="py-24 bg-[#0A1628] text-white relative z-10 border-t border-white/5">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Lançons votre projet</h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                  Un projet de construction, un besoin de formation ou de conseil en management ? Nos équipes reviennent vers vous sous 24 heures.
                </p>
                
                <form onSubmit={(e) => { e.preventDefault(); alert('Message envoyé ! Nous vous recontactons rapidement.'); }} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left space-y-6 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Nom Complet</label>
                      <input type="text" required placeholder="Votre nom" className="w-full bg-white/10 border border-white/10 p-3 rounded-xl focus:border-blue-400 outline-none text-white font-medium" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Adresse Email</label>
                      <input type="email" required placeholder="nom@entreprise.com" className="w-full bg-white/10 border border-white/10 p-3 rounded-xl focus:border-blue-400 outline-none text-white font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Votre Message</label>
                    <textarea rows={4} required placeholder="Expliquez-nous brièvement votre besoin..." className="w-full bg-white/10 border border-white/10 p-3 rounded-xl focus:border-blue-400 outline-none text-white font-medium resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-[#1A2CB5] hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-center uppercase tracking-widest text-xs cursor-pointer">
                    Envoyer la Demande
                  </button>
                </form>
              </div>
            </section>
          );
        }

        // 7. BANDEAU D'APPEL À L'ACTION (CTA)
        if (sectionKey === 'cta') {
          return (
            <section key="cta" className="py-24 bg-white border-t border-gray-50">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-black text-black tracking-tight mb-6">{homepageData.ctaTitle}</h2>
                <p className="text-xl text-gray-500 mb-10">
                  {homepageData.ctaSubtitle}
                </p>
                <Link to={homepageData.ctaBtnLink} className="inline-flex items-center justify-center px-10 py-5 bg-[#1A2CB5] text-white rounded-full font-bold text-lg hover:bg-[#152391] hover:scale-105 hover:shadow-xl transition-all duration-300">
                  {homepageData.ctaBtnText}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}


