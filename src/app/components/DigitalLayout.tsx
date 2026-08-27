import { Outlet } from 'react-router';
import { DigitalNavigation } from './DigitalNavigation';
import { ScrollToTop } from './ScrollToTop';
import { BackToTopButton } from './BackToTopButton';
import { Toaster } from 'sonner';

export function DigitalLayout() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-['Inter'] relative overflow-hidden">
      <ScrollToTop />
      {/* Dynamic Background elements for "Liquid Glass" effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/30 mix-blend-multiply filter blur-[100px] animate-blob z-0" />
      <div className="fixed top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-emerald-300/30 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 z-0" />
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-sky-300/30 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <DigitalNavigation />
        
        <main className="flex-1 pt-24">
          <Outlet />
        </main>
        
        {/* Light Glassmorphic Footer */}
        <footer className="mt-auto border-t border-white/40 bg-white/40 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="text-white font-['JetBrains_Mono'] font-bold text-lg">F</span>
                  </div>
                  <div>
                    <div className="text-slate-800 font-['JetBrains_Mono'] font-bold text-lg tracking-wider">
                      FREEMAN
                    </div>
                    <div className="text-slate-500 font-['JetBrains_Mono'] text-[10px] tracking-[0.2em]">
                      LIMITED
                    </div>
                  </div>
                </div>
                <p className="font-['Inter'] text-sm text-slate-500 font-medium">
                  BUILD · LAUNCH · SCALE
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-['JetBrains_Mono'] font-bold text-slate-800 mb-4">Navigation</h4>
                <ul className="space-y-2">
                  {['SaaS', 'Formations', 'Services', 'Équipe', 'Contact'].map((item) => (
                    <li key={item}>
                      <a
                        href={
                          item === 'Services' ? '/digital/services' :
                          item === 'Contact' ? '/digital/contact' :
                          item === 'Équipe' ? '/team' :
                          `/${item.toLowerCase()}`
                        }
                        className="font-['Inter'] text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-['JetBrains_Mono'] font-bold text-slate-800 mb-4">Légal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="font-['Inter'] text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
                      Mentions légales
                    </a>
                  </li>
                  <li>
                    <a href="#" className="font-['Inter'] text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
                      Politique de confidentialité
                    </a>
                  </li>
                  <li>
                    <a href="#" className="font-['Inter'] text-sm text-slate-600 hover:text-blue-600 transition-colors font-medium">
                      CGV
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/50 text-center">
              <p className="font-['Inter'] text-sm text-slate-500 font-medium">
                © 2026 Freeman LTD. Tous droits réservés.
              </p>
            </div>
          </div>
        </footer>
      </div>
      <BackToTopButton />
      <Toaster position="top-right" theme="light" />
    </div>
  );
}
