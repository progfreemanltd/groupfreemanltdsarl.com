import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, Heart, MessageCircle, ShoppingCart, ShieldCheck, CheckCircle2, Star, Share2, User, Package, Scale, Tag, Box, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currency } = useCurrency(); // On a le choix d'afficher en FCFA ou la devise active
  const { user, userData } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Produit introuvable.");
          navigate('/boutique');
        }
      } catch (error) {
        console.error(error);
        toast.error("Erreur de chargement du produit.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Veuillez vous créer un compte Acheteur pour commander.");
      navigate('/connexion');
      return;
    }

    addToCart({
      id: product.id,
      title: product.title,
      priceValue: product.priceValue,
      priceCurrency: product.priceCurrency,
      vendorId: product.vendorId,
      vendorName: product.vendor,
      image: product.image
    });

    try {
      await addDoc(collection(db, 'notifications'), {
        vendorId: product.vendorId,
        customerId: user.uid,
        customerName: userData?.name || user.email,
        productId: product.id,
        productTitle: product.title,
        type: 'cart_add',
        message: "A ajouté ce produit à son panier.",
        createdAt: serverTimestamp(),
        read: false
      });
    } catch(e) {
      console.error(e);
    }

    toast.success("Ajouté au panier !");
  };

  if (loading) {
    return (
      <div className="w-full bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="text-[#1A2CB5] animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 font-sans">
      
      {/* Navigation Top */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/boutique" className="flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm transition-colors">
            <ArrowLeft size={16} /> Retour à la boutique
          </Link>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-[#1A2CB5]"><Share2 size={20} /></button>
            <button className="hover:text-red-500"><Heart size={20} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Photos (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="w-full h-[500px] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
               <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
               <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm flex items-center gap-2">
                 <CheckCircle2 size={14} className="text-green-500" /> Produit Vérifié
               </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Description détaillée</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Package size={24} className="text-gray-400 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">En Stock</span>
                  <span className="font-black text-gray-900 mt-1">{product.stock || 0} u</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Scale size={24} className="text-gray-400 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Poids unitaire</span>
                  <span className="font-black text-gray-900 mt-1">{product.weight ? `${product.weight} kg` : 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Tag size={24} className="text-gray-400 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Référence</span>
                  <span className="font-black text-gray-900 mt-1 text-xs break-all">{product.sku || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Box size={24} className="text-gray-400 mb-2" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Variantes</span>
                  <span className="font-black text-gray-900 mt-1 text-xs">{product.variants || 'Standard'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achat & Vendeur (Col 3) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Box Achat */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{product.category}</div>
               <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">{product.title}</h1>
               
               <div className="text-4xl font-black text-[#1A2CB5] mb-2">
                  {Number(product.priceValue).toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
               </div>
               <div className="text-sm text-gray-500 mb-8">+ Taxes et frais d'expédition locaux (HT)</div>

               <button 
                  onClick={handleAddToCart} 
                  disabled={product.stock <= 0}
                  className={`w-full py-4 font-black rounded-xl transition-colors shadow-lg flex items-center justify-center gap-3 mb-4 group ${product.stock <= 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#1A2CB5] text-white hover:bg-black'}`}
               >
                 <ShoppingCart size={20} className={product.stock > 0 ? "group-hover:scale-110 transition-transform" : ""} /> 
                 {product.stock <= 0 ? "En Rupture de Stock" : "Ajouter au panier"}
               </button>

               <div className="mt-6 pt-6 border-t border-gray-100">
                 <div className="flex items-start gap-3 mb-4">
                   <ShieldCheck className="text-green-500 flex-shrink-0" size={24} />
                   <div>
                     <h4 className="font-bold text-sm text-gray-900">Paiement Sécurisé "Leboncoin"</h4>
                     <p className="text-xs text-gray-500 mt-1">L'argent est bloqué par Freeman Group jusqu'à réception de la commande.</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Box Vendeur */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-4">À propos du vendeur</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
                    <User className="text-gray-400" size={24} />
                 </div>
                 <div>
                   <h4 className="font-black text-gray-900">{product.vendor}</h4>
                   <div className="flex items-center gap-1 text-[#d4af37] text-sm mt-1">
                     <Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" />
                   </div>
                 </div>
               </div>
               
               <div className="space-y-3">
                 <button onClick={() => navigate(`/messages/nouveau?to=${product.vendorId}&product=${product.id}`)} className="w-full py-3 bg-gray-50 text-[#1A2CB5] font-bold rounded-xl border border-gray-200 hover:bg-[#1A2CB5] hover:text-white hover:border-[#1A2CB5] transition-all flex items-center justify-center gap-2">
                   <MessageCircle size={18} /> Contacter le vendeur
                 </button>
                 <button onClick={() => navigate(`/messages/nouveau?to=${product.vendorId}&product=${product.id}&rfq=true`)} className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl border-2 border-gray-100 hover:border-[#1A2CB5] transition-all flex items-center justify-center gap-2 group">
                   <FileText size={18} className="text-gray-400 group-hover:text-[#1A2CB5]" /> Demander un Devis
                 </button>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
