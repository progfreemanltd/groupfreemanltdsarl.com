import { UploadCloud, CheckCircle2, Loader2, ArrowLeft, Eye } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { MARKETPLACE_CATEGORIES } from '../data/marketplaceCategories';
import { useAuth } from '../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export function VendorNewAdPage() {
  const { user, userData } = useAuth();
  
  // Navigation du formulaire
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  
  // Champs
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');
  const [catLevel3, setCatLevel3] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [weight, setWeight] = useState('');
  const [sku, setSku] = useState('');
  const [variants, setVariants] = useState('');

  // Selected parent objects to dynamically render the next selects
  const selectedL1 = MARKETPLACE_CATEGORIES.find(c => c.id === catLevel1);
  const selectedL2 = selectedL1?.subcategories.find(c => c.id === catLevel2);

  const handleGoToRecap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez vous connecter en tant que Vendeur Pro pour déposer une annonce.");
      return;
    }
    // Validation basique
    if (!title || !price || !description || !catLevel1 || !stock || !weight) {
      toast.error("Veuillez remplir tous les champs obligatoires (incluant le stock et le poids).");
      return;
    }
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      let categoryPath = selectedL1?.name || "B2B";
      
      const newProduct = {
        title,
        priceValue: Number(price),
        priceCurrency: "XOF",
        priceUnit: "HT",
        description,
        categoryId: catLevel3 || catLevel2 || catLevel1,
        category: categoryPath,
        parentIds: [catLevel1, catLevel2, catLevel3].filter(Boolean),
        vendor: userData?.name || "Vendeur Pro",
        vendorId: user?.uid,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        rating: 5,
        modificationsCount: 0,
        stock: Number(stock),
        sku: sku || `REF-${Math.floor(Math.random() * 100000)}`,
        weight: Number(weight),
        variants: variants,
        createdAt: serverTimestamp(),
        status: "pending_approval" // Sécurité : Modération post-publication
      };

      await addDoc(collection(db, 'products'), newProduct);
      setStep(3);
      
      // Cleanup for potential next ad
      setTitle('');
      setPrice('');
      setDescription('');
    } catch (error: any) {
      console.error(error);
      toast.error("Échec de la publication : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="w-full bg-[#f8f9fa] min-h-screen py-20 flex items-center justify-center font-sans">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black text-black mb-4">Annonce envoyée !</h2>
          <p className="text-gray-500 mb-8">Votre annonce a bien été transmise à notre équipe. Elle est actuellement <strong>en attente de modération</strong>. Vous serez notifié dès sa validation. Toute modification ultérieure nécessitera une nouvelle vérification.</p>
          <div className="flex flex-col gap-3">
            <Link to="/vendeur/dashboard" className="w-full py-4 bg-[#1A2CB5] text-white font-bold rounded-xl hover:bg-black transition-colors">
              Retour au Tableau de Bord
            </Link>
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-black font-medium text-sm mt-2">
              Déposer une autre annonce
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PROGRESS BAR */}
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-3xl font-black text-black">Déposer une annonce</h1>
           <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${step === 1 ? 'text-[#1A2CB5]' : 'text-gray-300'}`}>1. Rédaction</span>
              <div className="w-8 h-1 bg-gray-200 rounded-full"><div className={`h-full bg-[#1A2CB5] rounded-full transition-all ${step === 2 ? 'w-full' : 'w-0'}`}></div></div>
               <span className={`text-sm font-bold ${step === 2 ? 'text-[#1A2CB5]' : 'text-gray-300'}`}>2. Validation</span>
           </div>
        </div>
        
        {step === 1 && (
          <form onSubmit={handleGoToRecap} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Photos */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Photos du produit</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-blue-50 text-[#1A2CB5] rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={28} />
                </div>
                <span className="font-bold text-gray-900 mb-1">Ajouter des photos</span>
                <span className="text-sm text-gray-500">Glissez-déposez ou cliquez (Max 10 photos)</span>
              </div>
            </div>

            {/* Informations */}
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Caractéristiques</h2>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Titre de l'annonce</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Pelleteuse Volvo Neuf / Chaises de bureau ergonomiques..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all placeholder:text-gray-400 font-medium" required />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Choisir la catégorie principale</label>
                  <select 
                    value={catLevel1} onChange={e => { setCatLevel1(e.target.value); setCatLevel2(''); setCatLevel3(''); }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-bold text-gray-700 appearance-none shadow-sm" required>
                    <option value="">-- Sélectionnez --</option>
                    {MARKETPLACE_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {selectedL1 && selectedL1.subcategories && selectedL1.subcategories.length > 0 && (
                  <div className="pl-6 border-l-2 border-[#1A2CB5]/30">
                    <label className="block text-sm font-bold text-gray-600 mb-2">Sous-catégorie</label>
                    <select 
                      value={catLevel2} onChange={e => { setCatLevel2(e.target.value); setCatLevel3(''); }}
                      className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-medium text-gray-700 appearance-none" required>
                      <option value="">-- Spécifiez --</option>
                      {selectedL1.subcategories.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedL2 && selectedL2.items && selectedL2.items.length > 0 && (
                  <div className="pl-12 border-l-2 border-[#1A2CB5]/30">
                    <label className="block text-sm font-bold text-gray-500 mb-2">Précision (Type)</label>
                    <select 
                      value={catLevel3} onChange={e => setCatLevel3(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all text-sm font-medium text-gray-600 appearance-none" required>
                      <option value="">-- Exactement --</option>
                      {selectedL2.items.map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prix (HT)</label>
                    <div className="relative">
                      <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-bold text-lg" required />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">FCFA</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Stock disponible</label>
                    <input type="number" min="1" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Quantité" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-bold" required />
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Référence interne / SKU (Optionnel)</label>
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Ex: FREEMAN-001" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-medium placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Poids Unitaire (Kg)</label>
                  <input type="number" min="0" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ex: 12.5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-medium placeholder:text-gray-400" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Variantes (Tailles, Couleurs...) - Optionnel</label>
                <input type="text" value={variants} onChange={(e) => setVariants(e.target.value)} placeholder="Ex: Tailles: S, M, L / Couleurs: Rouge, Noir" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all font-medium placeholder:text-gray-400" />
                <p className="text-xs text-gray-500 mt-2 font-medium">Spécifiez les variations. L'acheteur précisera son choix lors de la commande.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description détaillée</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Décrivez votre produit/service, ses caractéristiques techniques, la garantie..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] outline-none transition-all resize-none font-medium" required></textarea>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
              <Link to="/vendeur/dashboard" className="px-6 py-3 font-bold text-gray-600 hover:text-black transition-colors">
                Annuler
              </Link>
              <button type="submit" className="px-8 py-3 bg-[#1A2CB5] text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2">
                <Eye size={18} /> Continuer vers la validation
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 : RECAPITULATIF */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-[#1A2CB5] p-6 text-white text-center">
              <h2 className="text-xl font-black">Vérification Finale</h2>
              <p className="text-blue-200 text-sm mt-2 max-w-2xl mx-auto">Veuillez relire attentivement votre publication. <br/><strong>Sécurité B2B :</strong> Toute modification ultérieure de cette annonce après sa validation entraînera sa suspension temporaire pour révision manuelle par notre équipe.</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex gap-6 items-start pb-6 border-b border-gray-100">
                 <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80" alt="Draft" className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{title}</h3>
                    <div className="text-[#1A2CB5] font-black mt-2 text-xl">{Number(price).toLocaleString('fr-FR')} FCFA</div>
                 </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</h4>
                <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Catégorie</h4>
                <p className="text-gray-900 font-bold bg-gray-50 px-4 py-2 rounded-lg inline-block border border-gray-200">{selectedL1?.name}</p>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between gap-4">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-3 font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                <ArrowLeft size={18} /> Revenir et modifier
              </button>
              <button onClick={handleFinalSubmit} disabled={loading} className="px-8 py-3 bg-[#d4af37] text-black font-black rounded-xl hover:bg-black hover:text-white transition-colors shadow-lg disabled:opacity-70 flex items-center justify-center gap-2">
                {loading && <Loader2 size={18} className="animate-spin" />}
                <CheckCircle2 size={18} /> Confirmer et Publier
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
