import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp, Lock, ShoppingBag, Leaf, ExternalLink, Monitor, HardHat, Users, Hotel, Ruler, Store, Sparkles, ArrowRight, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';

export function CorporateNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'À propos', path: '/about' },
    { label: 'Nos Services', path: '/services' },
    { label: 'Nos Réalisations', path: '/portfolio' },
    { label: 'Investir ici', path: '/investments' },
    { label: 'Blog', path: '/blog' },
    { label: 'Marketplace', path: '/boutique' }
  ];

  return (
    <>
      {/* Thin Ticker Promo Bar */}
      <div className="bg-[#1a0429] text-white py-1.5 relative z-[60] border-b border-[#2a0845] overflow-hidden whitespace-nowrap">
        <motion.div 
          className="inline-block relative text-[11px] font-bold tracking-wider opacity-90"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <span className="mx-4 text-[#d4af37]">✨ NOUVEAU : OUVERTURE DE NOTRE MARKETPLACE POUR LES PROFESSIONNELS</span>
          <span className="mx-4 text-gray-500">|</span>
          <span className="mx-4">PROFITEZ DE -20% SUR NOS FORMATIONS (CODE: FREEMAN20)</span>
          <span className="mx-4 text-gray-500">|</span>
          <span className="mx-4 text-[#d4af37]">✨ NOUVEAU : OUVERTURE DE NOTRE MARKETPLACE POUR LES PROFESSIONNELS</span>
          <span className="mx-4 text-gray-500">|</span>
          <span className="mx-4">PROFITEZ DE -20% SUR NOS FORMATIONS (CODE: FREEMAN20)</span>
          <span className="mx-4 text-gray-500">|</span>
          <span className="mx-4 text-[#d4af37]">✨ NOUVEAU : OUVERTURE DE NOTRE MARKETPLACE POUR LES PROFESSIONNELS</span>
          <span className="mx-4 text-gray-500">|</span>
          <span className="mx-4">PROFITEZ DE -20% SUR NOS FORMATIONS (CODE: FREEMAN20)</span>
        </motion.div>
      </div>

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2' : 'bg-white py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group relative z-50">
              <img 
                src="/logo.png" 
                alt="Freeman Group" 
                className="h-16 sm:h-20 lg:h-24 xl:h-[110px] w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              
              if (link.label === 'Nos Services') {
                return (
                  <div key={link.path} className="relative group">
                    <Link
                      to={link.path}
                      className={`px-4 py-2 rounded-lg font-['Inter'] text-[15px] transition-all duration-300 block ${
                        isActive 
                          ? 'text-[#1A2CB5] font-bold bg-[#1A2CB5]/10' 
                          : 'text-gray-600 font-medium hover:bg-[#f8f9fa] hover:text-[#1A2CB5]'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {/* Mega Menu Unified & Ultra-Chic */}
                    <div className="absolute -left-16 top-full mt-3 w-[820px] bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50 flex gap-6">
                      
                      {/* Left Column: All Active Services & Filiales (66%) */}
                      <div className="w-[66%] border-r border-gray-100 pr-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Layers size={14} className="text-[#1A2CB5]" />
                            Nos Services & Filiales Actives
                          </h4>
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#1A2CB5]/10 text-[#1A2CB5]">
                            9 Solutions
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <Link to="/services/digital" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-[#1A2CB5]/5 transition-colors border border-transparent hover:border-[#1A2CB5]/15">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1A2CB5] flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-[#1A2CB5] group-hover/item:text-white transition-colors">
                              <Monitor size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-[#1A2CB5] transition-colors">Digital & IA</div>
                            <div className="text-[10px] text-gray-400 font-normal">SaaS, Mobile & IA</div>
                          </Link>

                          <Link to="/services/btp" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-500/15">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-orange-600 group-hover/item:text-white transition-colors">
                              <HardHat size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-orange-600 transition-colors">BTP & Immo</div>
                            <div className="text-[10px] text-gray-400 font-normal">Construction & MOE</div>
                          </Link>

                          <Link to="/services/management" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-500/15">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                              <Users size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-emerald-600 transition-colors">Management</div>
                            <div className="text-[10px] text-gray-400 font-normal">Conseil & Stratégie</div>
                          </Link>

                          <Link to="/services/hotellerie" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-500/15">
                            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-rose-600 group-hover/item:text-white transition-colors">
                              <Hotel size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-rose-600 transition-colors">Hôtellerie</div>
                            <div className="text-[10px] text-gray-400 font-normal">Tourisme & Asset</div>
                          </Link>

                          <Link to="/services/amenagement" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-purple-50/50 transition-colors border border-transparent hover:border-purple-500/15">
                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                              <Ruler size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-purple-600 transition-colors">Aménagement</div>
                            <div className="text-[10px] text-gray-400 font-normal">Design & Espaces</div>
                          </Link>

                          <Link to="/services/commerce" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-sky-50/50 transition-colors border border-transparent hover:border-sky-500/15">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-sky-600 group-hover/item:text-white transition-colors">
                              <Store size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-sky-600 transition-colors">Commerce</div>
                            <div className="text-[10px] text-gray-400 font-normal">Distribution & Retail</div>
                          </Link>

                          <Link to="/services/achat-livraison" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-500/15">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1A2CB5] flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-[#1A2CB5] group-hover/item:text-white transition-colors">
                              <ShoppingBag size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-[#1A2CB5] transition-colors">Achat Facile</div>
                            <div className="text-[10px] text-gray-400 font-normal">Mandats & Logistics</div>
                          </Link>

                          <Link to="/services/jardinage" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-emerald-50/50 transition-colors border border-transparent hover:border-emerald-500/15">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-colors">
                              <Leaf size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-800 group-hover/item:text-emerald-700 transition-colors">Jardin & Paysage</div>
                            <div className="text-[10px] text-gray-400 font-normal">Espaces verts</div>
                          </Link>

                          <a href="#" target="_blank" rel="noopener noreferrer" className="group/item flex flex-col p-2.5 rounded-xl hover:bg-amber-50/60 transition-colors border border-amber-200/50 bg-amber-50/20">
                            <div className="w-7 h-7 rounded-lg bg-[#d4af37]/20 text-amber-900 flex items-center justify-center shrink-0 mb-1.5 group-hover/item:bg-[#d4af37] group-hover/item:text-black transition-colors">
                              <ExternalLink size={15} />
                            </div>
                            <div className="text-xs font-bold text-gray-900 group-hover/item:text-[#d4af37] transition-colors flex items-center gap-1">
                              WAHONU <span className="text-[9px] text-amber-800 font-extrabold">↗</span>
                            </div>
                            <div className="text-[10px] text-gray-500 font-normal">Boutique Officielle</div>
                          </a>
                        </div>
                      </div>

                      {/* Right Column: Development Highlight (34%) */}
                      <div className="w-[34%] flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                            En Développement
                          </h4>

                          <Link
                            to="/services/en-developpement"
                            className="group/card block p-4 rounded-2xl bg-gradient-to-br from-[#1a0429] via-[#2a0845] to-[#1A2CB5] text-white shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10 hover:scale-[1.02] h-full flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                                  <Sparkles size={10} />
                                  9 Projets
                                </span>
                              </div>

                              <div className="text-sm font-black text-white group-hover/card:text-[#d4af37] transition-colors leading-tight">
                                Services & Filiales en création
                              </div>
                              
                              <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">
                                Transport, Hydrocarbures, Immo Prestige, École Internationale... Découvrez notre vision d'expansion.
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/10 text-xs font-bold text-[#d4af37] flex items-center justify-between group-hover/card:translate-x-1 transition-transform">
                              <span>Voir la feuille de route</span>
                              <ArrowRight size={14} />
                            </div>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-['Inter'] text-[15px] transition-all duration-300 relative group/navitem ${
                    isActive 
                      ? 'text-[#1A2CB5] font-bold bg-[#1A2CB5]/10' 
                      : 'text-gray-600 font-medium hover:bg-[#f8f9fa] hover:text-[#1A2CB5]'
                  }`}
                >
                  {link.label}
                  {link.label === 'Marketplace' && (
                    <span className="absolute -top-1.5 -right-1 text-[#d4af37] bg-[#d4af37]/10 p-0.5 rounded-md flex items-center justify-center transition-all group-hover/navitem:scale-110 group-hover/navitem:rotate-12 duration-300 shadow-sm" title="Boutique en ligne">
                      <ShoppingBag size={10} />
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Link 
              to="/freemancms/admin" 
              className="p-2.5 text-gray-500 hover:text-[#1A2CB5] hover:bg-gray-100/50 rounded-xl transition-all flex items-center justify-center"
              title="Administration CMS"
            >
              <Lock size={16} />
            </Link>
            <Link 
              to="/contact" 
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-black text-white rounded-lg font-['Inter'] text-[15px] font-medium hover:bg-[#1A2CB5] hover:text-white hover:shadow-lg transition-all duration-300"
            >
              Contact / Devis
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <div key={link.path} className="flex flex-col">
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-['Inter'] transition-all flex items-center justify-between gap-2 ${
                        isActive ? 'text-[#1A2CB5] font-bold bg-[#1A2CB5]/10' : 'text-gray-600 font-medium hover:bg-[#f8f9fa] hover:text-[#1A2CB5]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.label === 'Marketplace' && (
                        <span className="text-[#d4af37] bg-[#d4af37]/10 p-1 rounded-md flex items-center justify-center scale-90">
                          <ShoppingBag size={12} />
                        </span>
                      )}
                    </Link>
                    
                    {/* Mobile Submenu for Nos Services */}
                    {link.label === 'Nos Services' && (
                      <div className="flex flex-col pl-4 mt-2 space-y-1.5 border-l-2 border-gray-100 ml-2">
                        <Link 
                          to="/services"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 font-medium hover:text-[#1A2CB5]"
                        >
                          Nos Pôles d'expertise
                        </Link>
                        <Link 
                          to="/services/achat-livraison"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 font-medium hover:text-[#1A2CB5]"
                        >
                          Freeman Achat Facile
                        </Link>
                        <Link 
                          to="/services/jardinage"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-1.5 rounded-lg text-sm text-gray-600 font-medium hover:text-[#1A2CB5]"
                        >
                          Freeman Jardin & Paysage
                        </Link>
                        <a 
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-1.5 rounded-lg text-sm text-amber-800 font-medium hover:text-[#d4af37]"
                        >
                          WAHONU (Boutique) ↗
                        </a>
                        <Link 
                          to="/services/en-developpement"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold bg-[#1a0429] text-[#d4af37] flex items-center justify-between"
                        >
                          <span>Services en développement</span>
                          <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white">9 Projets</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 mt-4 text-center rounded-lg bg-black text-white font-['Inter'] font-medium hover:bg-[#1A2CB5] hover:text-white hover:shadow-lg transition-all"
              >
                Contact / Devis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.header>
    </>
  );
}
