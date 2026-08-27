import { useState } from 'react';
import { Outlet, Link } from 'react-router';
import { CorporateNavigation } from './CorporateNavigation';
import { ScrollToTop } from './ScrollToTop';
import { BackToTopButton } from './BackToTopButton';
import { Toaster, toast } from 'sonner';
import { useCMS } from '../context/CMSContext';
import { Linkedin, Twitter, Github, Facebook, Instagram, Youtube, Mail, Send, Sparkles, Wrench, ShieldCheck } from 'lucide-react';

export function CorporateLayout() {
  const { contactData, subscribeNewsletter } = useCMS();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide.');
      return;
    }
    await subscribeNewsletter(newsletterEmail, 'footer_corporate');
    toast.success('Merci pour votre inscription !', {
      description: 'Votre email a été enregistré et synchronisé avec succès.'
    });
    setNewsletterEmail('');
  };

  const mainCorporateLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'À propos', path: '/about' },
    { label: 'Nos Services', path: '/services' },
    { label: 'Nos Réalisations', path: '/portfolio' },
    { label: 'Investir ici', path: '/investments' },
    { label: 'Blog', path: '/blog' },
    { label: 'Marketplace', path: '/boutique' }
  ];

  const toolsAndResourcesLinks = [
    { label: 'Outils Gratuits (Logo, Image, Scan)', path: '/outils' },
    { label: 'Tutoriels & Formations', path: '/tutoriels' },
    { label: 'Portail Digital & IA', path: '/digital' },
    { label: 'Services en développement (9 projets)', path: '/services/en-developpement' },
    { label: 'Freeman Achat Facile', path: '/services/achat-livraison' },
    { label: 'Freeman Jardin & Paysage', path: '/services/jardinage' }
  ];

  const legalAndInfoLinks = [
    { label: 'Contact / Devis', path: '/contact' },
    { label: 'Mentions légales', path: '/mentions-legales' },
    { label: 'Politique de confidentialité', path: '/politique-confidentialite' },
    { label: 'Conditions Générales (CGV/CGU)', path: '/cgv' },
    { label: 'Administration CMS', path: '/freemancms/admin' }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-['Inter'] relative flex flex-col">
      {/* Scroll automatique en haut à chaque changement de route */}
      <ScrollToTop />

      <CorporateNavigation />

      <main className="flex-1 w-full bg-white relative z-10 flex flex-col">
        <Outlet />
      </main>

      {/* Bouton flottant retour en haut */}
      <BackToTopButton />
      {/* Corporate Footer */}
      <footer className="mt-auto border-t border-gray-100 bg-[#f8f9fa] pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Newsletter Banner Block */}
          <div className="bg-gradient-to-r from-gray-950 via-[#1A2CB5] to-[#1a0429] rounded-3xl p-8 sm:p-10 text-white mb-16 shadow-2xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#d4af37] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={14} /> Newsletter Officielle
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Restez informé des innovations du groupe
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Recevez nos actualités, lancements de nouveaux outils gratuits et opportunités d'investissement directement dans votre boîte mail.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="relative w-full sm:w-80">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre adresse e-mail..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#d4af37] text-black font-bold rounded-2xl hover:bg-white transition-all duration-300 text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <span>S'abonner</span>
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Main Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            {/* Column 1: Brand Info (2 Columns wide on LG) */}
            <div className="lg:col-span-2">
              <Link to="/">
                <img 
                  src="/logo.png" 
                  alt="Freeman Group" 
                  className="h-20 sm:h-24 w-auto object-contain mb-6 transform scale-[1.2] origin-left" 
                />
              </Link>
              <p className="mt-2 text-gray-500 font-['Inter'] leading-relaxed max-w-sm text-sm mb-6">
                Groupe multi-secteurs expert en Digital, BTP, Management, Hôtellerie, Aménagement et Commerce. Construit pour durer, pensé pour innover.
              </p>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div><strong className="text-gray-700">Siège :</strong> Cotonou, République du Bénin</div>
                <div><strong className="text-gray-700">Contact :</strong> contact@freemangroup.bj</div>
              </div>
            </div>

            {/* Column 2: Navigation Corporate */}
            <div>
              <h4 className="font-bold text-black mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                Navigation
              </h4>
              <ul className="space-y-3">
                {mainCorporateLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-500 text-sm hover:text-[#1A2CB5] font-medium transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Outils & Ressources */}
            <div>
              <h4 className="font-bold text-black mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                <Wrench size={14} className="text-[#1A2CB5]" />
                Outils & Ressources
              </h4>
              <ul className="space-y-3">
                {toolsAndResourcesLinks.map((link) => (
                  <li key={link.path}>
                    {link.path.startsWith('http') ? (
                      <a href={link.path} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-[#1A2CB5] font-medium transition-colors">
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.path} className="text-gray-500 text-sm hover:text-[#1A2CB5] font-medium transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Légal & Infos */}
            <div>
              <h4 className="font-bold text-black mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#1A2CB5]" />
                Informations & Légal
              </h4>
              <ul className="space-y-3">
                {legalAndInfoLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-gray-500 text-sm hover:text-[#1A2CB5] font-medium transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright, Payment Badges & Social Links */}
          <div className="pt-8 border-t border-gray-200/80 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-medium text-gray-400 text-xs">© 2026 Freeman Group. Tous droits réservés.</p>
            
            {/* Payment & Partner badges */}
            {((contactData.activePayments || []).length > 0 || (contactData.partners || []).length > 0) && (
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                {(contactData.activePayments || []).map((provider) => {
                  if (provider === 'visa') {
                    return (
                      <div key={provider} className="h-8 px-2.5 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm select-none hover:shadow hover:border-gray-350 transition-all" title="Visa">
                        <svg className="h-3.5 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M37.915 2.148L32.179 26.69H23.013L15.937 7.02c-.822-3.13-1.636-4.04-4.108-5.385V1.24h14.545c3.27 0 5.727 2.173 6.452 5.617l3.824 19.833h9.191l14.15-24.542h-9.276z" fill="#1A1F71"/>
                          <path d="M83.844 2.148L76.108 26.69h-8.083L60.279 2.148h8.562l4.894 17.514 4.543-17.514h5.566z" fill="#1A1F71"/>
                          <path d="M96.792 2.148L89.479 26.69H81.25l7.313-24.542h8.229z" fill="#1A1F71"/>
                          <path d="M2.937 2.148h.276l10.96 17.275 1.547-7.905c-.655-2.072-2.545-3.83-5.34-5.26L2.937 2.148zm50.841 8.283c-.097-4.148-3.72-5.71-8.15-5.918-4.717-.22-9.428.989-11.458 1.954l-1.626 7.828c2.145-1.026 6.134-1.953 9.472-1.953 3.63 0 5.677.892 5.698 2.378.024 1.704-2.008 2.651-5.289 4.249-4.832 2.355-7.939 4.887-7.9 9.38.05 4.385 3.86 6.963 9.27 6.963 4.14 0 7.733-1.042 10.024-2.22l1.6-7.7c-2.18 1.155-5.836 2.05-8.868 2.05-3.23 0-5.187-.852-5.207-2.316-.025-1.85 2.502-2.825 5.867-4.464 4.85-2.368 6.43-5.062 6.367-10.334z" fill="#F7B600"/>
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'mastercard') {
                    return (
                      <div key={provider} className="h-8 px-2.5 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm select-none hover:shadow hover:border-gray-350 transition-all" title="Mastercard">
                        <svg className="h-4.5 w-auto" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="35" cy="30" r="28" fill="#EB001B" opacity="0.9" />
                          <circle cx="65" cy="30" r="28" fill="#F79E1B" opacity="0.9" />
                          <path d="M50 8.4a27.8 27.8 0 0 0-11 21.6c0 8.5 3.9 16.1 11 21.6a27.8 27.8 0 0 0 11-21.6C61 17 57.1 9.4 50 8.4z" fill="#FF5F00" />
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'momo') {
                    return (
                      <div key={provider} className="h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm select-none border border-gray-200 bg-white" title="MTN MoMo">
                        <svg className="h-8 w-auto" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="120" height="40" rx="8" fill="#FFCC00" />
                          <rect x="8" y="8" width="44" height="24" rx="12" fill="none" stroke="#000000" stroke-width="2.5" />
                          <text x="30" y="25" font-family="sans-serif" font-weight="900" font-size="12" fill="#000000" text-anchor="middle" letter-spacing="-0.5">MTN</text>
                          <text x="62" y="26" font-family="sans-serif" font-weight="900" font-size="15" fill="#000000" letter-spacing="-0.5">MoMo</text>
                          <circle cx="108" cy="22" r="3.5" fill="#E31837" />
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'moov') {
                    return (
                      <div key={provider} className="h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm select-none border border-gray-200 bg-white" title="Moov Money">
                        <svg className="h-8 w-auto" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="130" height="40" rx="8" fill="#003366" />
                          <text x="12" y="27" font-family="sans-serif" font-style="italic" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="-1">moov</text>
                          <path d="M74 24 C 85 20, 95 20, 105 25" stroke="#FF6600" stroke-width="3" fill="none" stroke-linecap="round" />
                          <text x="72" y="26" font-family="sans-serif" font-weight="900" font-size="11" fill="#FF6600" letter-spacing="0.5">MONEY</text>
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'celtis') {
                    return (
                      <div key={provider} className="h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm select-none border border-gray-200 bg-white" title="Celtis Cash">
                        <svg className="h-8 w-auto" viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="110" height="40" rx="8" fill="#00A88F" />
                          <text x="55" y="26" font-family="sans-serif" font-weight="800" font-size="17" fill="#FFFFFF" text-anchor="middle" letter-spacing="-0.5">celtis</text>
                          <circle cx="92" cy="14" r="3" fill="#FF6600" />
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'orange') {
                    return (
                      <div key={provider} className="h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm select-none border border-gray-200 bg-white" title="Orange Money">
                        <svg className="h-8 w-auto" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="130" height="40" rx="8" fill="#F8F9FA" stroke="#E2E8F0" stroke-width="1" />
                          <rect x="10" y="10" width="20" height="20" fill="#FF6600" />
                          <text x="36" y="24" font-family="sans-serif" font-weight="800" font-size="12" fill="#000000" letter-spacing="-0.5">orange</text>
                          <text x="82" y="24" font-family="sans-serif" font-weight="900" font-size="11" fill="#FF6600" letter-spacing="0.5">money</text>
                        </svg>
                      </div>
                    );
                  }
                  if (provider === 'wave') {
                    return (
                      <div key={provider} className="h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm select-none border border-gray-200 bg-white" title="Wave Mobile Money">
                        <svg className="h-8 w-auto" viewBox="0 0 110 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="110" height="40" rx="8" fill="#1A9CFC" />
                          <text x="32" y="26" font-family="sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" letter-spacing="-0.5">wave</text>
                          <circle cx="85" cy="20" r="7" fill="#FFFFFF" />
                          <circle cx="82" cy="18" r="1.5" fill="#1A9CFC" />
                          <circle cx="88" cy="18" r="1.5" fill="#1A9CFC" />
                          <path d="M83 23 Q 85 21, 87 23" stroke="#1A9CFC" stroke-width="1.5" fill="none" />
                        </svg>
                      </div>
                    );
                  }
                  return null;
                })}

                {/* Custom Partners / Certifications */}
                {(contactData.partners || []).map((partner, idx) => (
                  <div 
                    key={'partner-' + idx} 
                    className="h-8 px-3 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm select-none hover:shadow hover:border-gray-300 transition-all"
                    title={partner.name}
                  >
                    <img 
                      src={partner.imageUrl} 
                      alt={partner.name} 
                      className="h-5 w-auto object-contain" 
                      onError={(e) => { (e.target as any).src = 'https://placehold.co/80x50?text=Logo'; }} 
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {contactData.linkedin && (
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="LinkedIn">
                  <Linkedin size={15} />
                </a>
              )}
              {contactData.twitter && (
                <a href={contactData.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="Twitter">
                  <Twitter size={15} />
                </a>
              )}
              {contactData.github && (
                <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="GitHub">
                  <Github size={15} />
                </a>
              )}
              {contactData.facebook && (
                <a href={contactData.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="Facebook">
                  <Facebook size={15} />
                </a>
              )}
              {contactData.instagram && (
                <a href={contactData.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="Instagram">
                  <Instagram size={15} />
                </a>
              )}
              {contactData.youtube && (
                <a href={contactData.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center text-gray-500 shadow-sm" title="YouTube">
                  <Youtube size={15} />
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" theme="light" />
    </div>
  );
}
