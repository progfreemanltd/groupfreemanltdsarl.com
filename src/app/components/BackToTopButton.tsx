import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

/**
 * BackToTopButton — bouton flottant qui apparaît dès que l'utilisateur
 * descend de plus de 300px et le ramène au sommet en douceur.
 */
export function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={scrollToTop}
          aria-label="Retour en haut"
          title="Retour en haut de page"
          className="fixed bottom-6 right-6 z-[999] w-12 h-12 rounded-2xl bg-[#1A2CB5] text-white shadow-xl hover:bg-black hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
        >
          <ArrowUp
            size={20}
            className="group-hover:-translate-y-0.5 transition-transform duration-200"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
