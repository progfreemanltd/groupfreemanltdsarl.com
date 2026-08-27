import { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';

export function DigitalNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SAAS', path: '/saas' },
    { label: 'PROJETS', path: '/projects' },
    { label: 'FORMATIONS', path: '/formations' },
    { label: 'SERVICES', path: '/digital/services' },
    { label: 'ÉQUIPE', path: '/team' },
    { label: 'CONTACT', path: '/digital/contact' },
  ];

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl"
    >
      <nav className={`transition-all duration-500 rounded-full px-4 py-3 flex items-center justify-between ${isScrolled ? 'glass-panel shadow-lg shadow-blue-900/5' : 'bg-white/20 backdrop-blur-sm border border-white/40 shadow-sm'}`}>
        
        {/* Left Side: Mobile Menu or Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-600 p-3 glass-icon"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link 
            to="/"
            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full cursor-pointer glass-icon overflow-hidden relative group" 
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 group-hover:opacity-100 opacity-0 transition-opacity" />
            <span className="text-blue-600 font-['JetBrains_Mono'] font-black text-xl z-10">F</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2 bg-white/40 backdrop-blur-md border border-white/60 p-1.5 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 rounded-full font-['JetBrains_Mono'] text-xs lg:text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center ${
                  isActive 
                    ? 'glass-button font-bold text-white shadow-md shadow-blue-500/20' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-white/60 hover:shadow-sm'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Right Side: Status Indicator */}
        <div className="flex items-center space-x-3">
          <Link 
            to="/freemancms/admin" 
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-full glass-icon text-slate-500 hover:text-blue-600 transition-colors"
            title="Administration CMS"
          >
            <Lock size={16} />
          </Link>
          <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-white/80 shadow-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]" />
            </div>
            <span className="text-slate-600 font-['JetBrains_Mono'] text-[10px] tracking-widest font-bold">ONLINE</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-slate-600 font-['JetBrains_Mono'] text-xs tracking-widest uppercase font-bold px-4 py-3 glass-card-interactive">
            MENU
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 left-0 right-0 glass-panel p-6 mt-4 md:hidden shadow-xl shadow-blue-900/10 border-white/80 border-t-2 border-l-2"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-center px-6 py-4 rounded-2xl font-['JetBrains_Mono'] text-sm tracking-widest uppercase transition-all ${
                      isActive ? 'glass-button text-white font-bold' : 'glass-card-interactive text-slate-600 font-medium'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}