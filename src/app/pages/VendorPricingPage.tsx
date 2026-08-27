import { Check, Star } from 'lucide-react';
import { Link } from 'react-router';

export function VendorPricingPage() {
  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black text-black tracking-tight mb-4">
            Devenez Vendeur Partenaire <span className="text-[#1A2CB5]">Freeman Group</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Rejoignez une marketplace B2B sélective. Diffusez vos produits neufs et vos services auprès d'une audience qualifiée de professionnels et d'entreprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Plan Pro Starter */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Starter</h3>
            <p className="text-gray-500 text-sm mb-6">Idéal pour les artisans et PME souhaitant digitaliser leurs ventes.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-black">49 €</span>
              <span className="text-gray-500"> / mois (HT)</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm font-medium">Jusqu'à 50 annonces publiées simultanément</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm font-medium">Profil Vendeur certifié</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-gray-700 text-sm font-medium">Accès au Dashboard de statistiques basique</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-gray-100 text-gray-400 rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-gray-400 text-sm font-medium">Badge Partenaire Premium exclusif</span>
              </li>
            </ul>

            <Link to="/vendeur/dashboard" className="w-full py-4 text-center bg-gray-900 text-white font-bold rounded-xl hover:bg-[#1A2CB5] transition-colors">
              Souscrire à ce plan
            </Link>
          </div>

          {/* Plan Pro Premium (Most Popular) */}
          <div className="bg-[#1A2CB5] rounded-3xl p-8 border border-[#1A2CB5] shadow-xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-black font-black text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Star size={12} className="fill-black" /> Le plus rentable
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Partenaire Premium</h3>
            <p className="text-blue-200 text-sm mb-6">Pour les concessionnaires, grossistes et entreprises tech.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">129 €</span>
              <span className="text-blue-200"> / mois (HT)</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <div className="bg-[#d4af37] text-black rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="text-white text-sm font-bold">Annonces illimitées dans toutes les catégories</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#d4af37] text-black rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="text-white text-sm font-bold">Options "En Tête" automatiques (3x par semaine)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#d4af37] text-black rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="text-white text-sm font-bold">Dashboard Avancé (Vues, Conversions)</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-[#d4af37] text-black rounded-full p-1 mt-0.5">
                  <Check size={14} strokeWidth={4} />
                </div>
                <span className="text-white text-sm font-bold">Badge Premium exclusif affiché sur vos annonces</span>
              </li>
            </ul>

            <Link to="/vendeur/dashboard" className="w-full py-4 text-center bg-white text-black font-black rounded-xl hover:bg-[#d4af37] transition-colors shadow-lg">
              Devenir Partenaire Premium
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
