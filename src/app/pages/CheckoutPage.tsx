import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router';
import { Lock, ShieldCheck, ArrowRight, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { items, cartTotal, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [vendorVatMap, setVendorVatMap] = useState<Record<string, boolean>>({});
  const [calculatingVat, setCalculatingVat] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Solde
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setBalance(docSnap.data().walletBalance || 0);
        } else {
          setBalance(0);
        }

        // 2. TVA des vendeurs
        const uniqueVendorIds = [...new Set(items.map(i => i.vendorId))];
        const vatMap: Record<string, boolean> = {};
        
        for (const vId of uniqueVendorIds) {
          const vDoc = await getDoc(doc(db, 'users', vId));
          if (vDoc.exists()) {
            vatMap[vId] = !!vDoc.data().isVatEnabled;
          }
        }
        setVendorVatMap(vatMap);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
        setCalculatingVat(false);
      }
    }
    fetchData();
  }, [user, items]);

  // Calculs financiers
  const vatDetails = items.reduce((acc, item) => {
    const isVatEnabled = vendorVatMap[item.vendorId];
    const itemTotal = item.priceValue * item.quantity;
    const itemVat = isVatEnabled ? itemTotal * 0.18 : 0;
    
    return {
      totalVat: acc.totalVat + itemVat,
      totalTtc: acc.totalTtc + itemTotal + itemVat
    };
  }, { totalVat: 0, totalTtc: 0 });

  const finalTotal = vatDetails.totalTtc;

  const handleCheckout = async () => {
    if (isOffline) {
      toast.error("Connexion internet requise. La transaction est mise en attente.", { icon: '🗼' });
      return;
    }
    if (!user) {
      toast.error("Veuillez vous connecter pour procéder à l'achat.");
      navigate('/connexion');
      return;
    }
    if (balance === null || balance < finalTotal) {
      toast.error("Solde insuffisant dans votre portefeuille Freeman.");
      return;
    }

    setProcessing(true);
    try {
      // 1. Déduire l'argent du portefeuille (Total TTC)
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        walletBalance: balance - finalTotal
      });

      // 2. Créer la commande (Escrow)
      const orderData = {
        buyerId: user.uid,
        items: items.map(i => ({
          ...i,
          isVatApplied: !!vendorVatMap[i.vendorId],
          vatAmount: !!vendorVatMap[i.vendorId] ? i.priceValue * i.quantity * 0.18 : 0
        })),
        subtotalHt: cartTotal,
        totalVat: vatDetails.totalVat,
        totalAmount: finalTotal,
        currency: "XOF",
        status: "funds_locked",
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'orders'), orderData);

      // 3. Vider le panier
      clearCart();
      setSuccess(true);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur durant la transaction.");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="w-full bg-[#f8f9fa] min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Paiement Sécurisé !</h2>
          <p className="text-gray-600 mb-6">Vos fonds ont été sécurisés par Freeman Group. Le(s) vendeur(s) seront notifiés pour préparer la livraison. L'argent ne leur sera transféré que lorsque vous aurez validé la réception !</p>
          <Link to="/boutique" className="inline-block px-8 py-4 bg-[#1A2CB5] text-white font-bold rounded-xl hover:bg-black transition-colors">
             Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Votre Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liste des produits (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
             {items.length === 0 ? (
               <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                 <p className="text-gray-500 mb-6">Votre panier est actuellement vide.</p>
                 <Link to="/boutique" className="bg-[#1A2CB5] text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">Retour à la boutique</Link>
               </div>
             ) : (
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
                 {items.map(item => (
                   <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                     <div className="w-32 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 text-center sm:text-left">
                       <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                       <p className="text-sm text-gray-500 mt-1">Vendu par <span className="font-bold">{item.vendorName}</span></p>
                     </div>
                     <div className="text-center sm:text-right flex-shrink-0">
                       <div className="text-xl font-black text-[#1A2CB5]">{Number(item.priceValue).toLocaleString('fr-FR')} FCFA</div>
                       <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg mt-2 text-sm font-bold flex items-center justify-center gap-1 mx-auto sm:mr-0 sm:ml-auto transition-colors">
                         <Trash2 size={16} /> Retirer
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Résumé & Checkout (Col 3) */}
          <div className="lg:col-span-1">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl sticky top-8">
               <h2 className="text-xl font-black text-gray-900 mb-6">Résumé de la commande</h2>
               
               <div className="flex justify-between items-center mb-4 text-gray-600">
                  <span>Sous-total HT</span>
                  <span className="font-bold">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between items-center mb-4 text-gray-600">
                  <span>TVA Béninoise (18%)</span>
                  {calculatingVat ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span className="font-bold">{vatDetails.totalVat.toLocaleString('fr-FR')} FCFA</span>
                  )}
                </div>
                <div className="flex justify-between items-center pb-6 border-b border-gray-100 text-gray-600">
                  <span>Frais de protection (Escrow)</span>
                  <span className="font-bold text-green-500">Offert</span>
                </div>

                <div className="flex justify-between items-end mt-6 mb-8">
                  <span className="font-bold text-gray-900">Total TTC</span>
                  <span className="text-3xl font-black text-[#1A2CB5]">{finalTotal.toLocaleString('fr-FR')} FCFA</span>
                </div>

                {user ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-gray-700">Votre Solde Portefeuille</span>
                      {loading ? <Loader2 size={16} className="animate-spin text-gray-400" /> : <span className="font-black text-gray-900">{balance?.toLocaleString('fr-FR') || 0} FCFA</span>}
                    </div>
                    {(balance !== null && balance < finalTotal) ? (
                     <div className="text-xs text-red-500 font-bold mb-3">Solde insuffisant pour cet achat</div>
                   ) : (
                     <div className="text-xs text-green-600 font-bold mb-3 flex items-center gap-1"><ShieldCheck size={14}/> Solde suffisant</div>
                   )}
                   <Link to="/client/wallet" className="block text-center text-xs font-bold text-[#1A2CB5] uppercase underline">Recharger le Portefeuille</Link>
                 </div>
               ) : (
                 <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-[#1A2CB5] font-medium text-center">
                   Vous devez vous connecter avant de vérifier votre solde.
                 </div>
               )}

                <button 
                  onClick={handleCheckout} 
                  disabled={items.length === 0 || !user || balance === null || balance < finalTotal || processing || isOffline || calculatingVat}
                  className="w-full py-4 bg-[#1A2CB5] text-white font-black rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                 {processing ? <Loader2 size={20} className="animate-spin" /> : <><Lock size={18} /> {isOffline ? 'En attente réseau...' : 'Payer en toute sécurité'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
               </button>
               
               <div className="mt-4 text-center">
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">Transactions traitées par Freeman Fintech Group selon les normes anti-fraude internationales</p>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
