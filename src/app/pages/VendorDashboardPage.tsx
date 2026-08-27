import { Eye, MessageCircle, Heart, PlusSquare, ArrowUpRight, CheckCircle2, Box, Star, LogOut, Settings, Edit3, Trash2, Camera, Loader2, User, Target, ShoppingBag, Banknote, MapPin, Search, FileText, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

export function VendorDashboardPage() {
  const { user, userData, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'analytics' | 'ads' | 'wallet' | 'settings'>(
    (tabParam as any) || 'analytics'
  );

  useEffect(() => {
    if (tabParam && ['analytics', 'ads', 'wallet', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);
  const [isVatEnabled, setIsVatEnabled] = useState(userData?.isVatEnabled || false);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<any>(null);
  const [isValidatingDelivery, setIsValidatingDelivery] = useState(false);
  const [deliveryProofs, setDeliveryProofs] = useState({ invoice: null, deliveryNote: null, photo: null });

  // Redirection si non connecté (Attendre le chargement de l'Auth)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role === 'customer')) {
      navigate('/connexion');
    }
  }, [user, userData, authLoading, navigate]);

  // Récupération des données métiers (Listings & Orders) en live
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const qProducts = query(collection(db, 'products'), where("vendorId", "==", user.uid));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const fetchedListings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedListings.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setListings(fetchedListings);
    });

    const qOrders = query(collection(db, 'orders'), where("items", "!=", null)); // Workaround: fetched, then filtered locally for items vendorId
    // Pour l'Escrow B2B: order contient un array items[]. 
    // Pour simplifier l'exemple, on va chercher toutes les commandes et filtrer sur celles qui concernent ce vendeur.
    // Dans une DB prod structurée on ferait une collection séparée order_items 
    const qAllOrders = query(collection(db, 'orders'));
    const unsubscribeOrders = onSnapshot(qAllOrders, (snapshot) => {
       const fetchedOrders: any[] = [];
       snapshot.docs.forEach(doc => {
         const data = doc.data();
         if (data.items && Array.isArray(data.items)) {
           // Si au moins un objet appartient à ce vendeur
           const vendorItems = data.items.filter((item: any) => item.vendorId === user.uid);
           if (vendorItems.length > 0) {
             fetchedOrders.push({ id: doc.id, ...data, vendorSpecificItems: vendorItems });
           }
         }
       });
       setOrders(fetchedOrders);
       setLoading(false);
    });

    return () => { unsubscribeProducts(); unsubscribeOrders(); };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success("Vous êtes déconnecté.");
  };

  const handleToggleVat = async () => {
    const newVal = !isVatEnabled;
    setIsVatEnabled(newVal);
    try {
      if (user) await updateDoc(doc(db, 'users', user.uid), { isVatEnabled: newVal });
      toast.success(newVal ? "TVA (18%) activée pour vos ventes." : "TVA désactivée.");
    } catch (e) {
      toast.error("Erreur de mise à jour");
      setIsVatEnabled(!newVal);
    }
  };

  const handleValidateDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForDelivery) return;
    setIsValidatingDelivery(true);
    
    try {
      // Simulation d'upload de preuves (en prod on utiliserait Firebase Storage)
      const proofs = {
        invoicePath: "simulated/invoice.pdf",
        deliveryNotePath: "simulated/note.pdf",
        photoPath: "simulated/photo.jpg",
        timestamp: new Date().toISOString()
      };

      await updateDoc(doc(db, 'orders', selectedOrderForDelivery.id), {
        status: 'delivered_by_vendor',
        vendorProofs: proofs
      });

      toast.success("Livraison validée avec succès ! Les preuves ont été transmises à l'acheteur.");
      setSelectedOrderForDelivery(null);
    } catch (e) {
      toast.error("Erreur lors de la validation.");
    } finally {
      setIsValidatingDelivery(false);
    }
  };

  // KPIs
  const totalRevenue = orders.reduce((total, order) => {
    return total + order.vendorSpecificItems.reduce((t: number, item: any) => t + (item.priceValue * item.quantity), 0);
  }, 0);
  
  // Simulations Mathématiques pour KPIs avancés 
  // (à remplacer par de vraies requêtes Firebase Functions une fois structuré)
  const viewsSimulated = listings.length * 142;
  const clicksSimulated = Math.floor(viewsSimulated * 0.15);
  const abandonedCartSimulated = Math.floor(listings.length * 2.5);

  if (loading) {
    return (
      <div className="w-full bg-[#f8f9fa] min-h-screen flex items-center justify-center">
        <Loader2 size={48} className="text-[#1A2CB5] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (userData?.status === 'pending') {
    return (
      <div className="w-full bg-[#f8f9fa] min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 text-center shadow-xl">
          <div className="w-20 h-20 bg-orange-100 text-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-6">
             <Target size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">En cours de vérification</h2>
          <p className="text-gray-500 mb-8 font-medium">
            Bonjour <strong>{userData?.name || 'Vendeur'}</strong>, votre compte professionnel B2B est actuellement en cours d'examen par l'équipe Freeman Group.<br/><br/>
            Nous vérifions vos documents légaux (Numéro IFU, RCCM). Vous aurez accès à votre espace dès que l'administrateur aura validé votre profil.
          </p>
          <div className="flex flex-col gap-4">
             <button onClick={() => navigate('/boutique')} className="w-full bg-[#1A2CB5] text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors">Retour à la boutique</button>
             <button onClick={handleLogout} className="text-red-500 font-bold hover:underline text-sm">Se déconnecter</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-20 font-sans">
      
      {/* Dashboard Top Header */}
      <div className="bg-white border-b border-gray-200 pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1A2CB5] text-white rounded-2xl shadow-md flex items-center justify-center overflow-hidden">
                <span className="text-2xl font-black">{userData?.name?.charAt(0) || 'P'}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-black">Hub Vendeur</h1>
                  <span className="bg-[#d4af37] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest hidden sm:inline-block shadow-sm">Premium Exclusif</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Bienvenue, <strong className="text-black">{userData?.name}</strong>. Voici vos performances du mois.</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link to="/messages" className="flex items-center gap-2 bg-blue-50 text-[#1A2CB5] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors shadow-sm border border-blue-200">
                <MessageCircle size={18} /> Messagerie Clients
              </Link>
              <Link to="/vendeur/nouvelle-annonce" className="flex items-center gap-2 bg-[#1A2CB5] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-sm">
                <PlusSquare size={18} /> Déposer un Produit
              </Link>
            </div>
          </div>
          
          {/* Navigation inter-onglets */}
          <div className="flex items-center justify-between mt-8 border-b border-gray-100 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-8 min-w-max">
              <button onClick={() => setActiveTab('analytics')} className={`whitespace-nowrap font-bold pb-3 border-b-2 transition-colors ${activeTab === 'analytics' ? 'text-[#1A2CB5] border-[#1A2CB5]' : 'text-gray-500 border-transparent hover:text-black'}`}>Analytiques & Ventes</button>
              <button onClick={() => setActiveTab('ads')} className={`whitespace-nowrap font-bold pb-3 border-b-2 transition-colors ${activeTab === 'ads' ? 'text-[#1A2CB5] border-[#1A2CB5]' : 'text-gray-500 border-transparent hover:text-black'}`}>Mes Annonces in-app</button>
              <button onClick={() => setActiveTab('wallet')} className={`whitespace-nowrap font-bold pb-3 border-b-2 transition-colors ${activeTab === 'wallet' ? 'text-[#1A2CB5] border-[#1A2CB5]' : 'text-gray-500 border-transparent hover:text-black'}`}>Portefeuille & Séquestre</button>
              <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap font-bold pb-3 border-b-2 transition-colors ${activeTab === 'settings' ? 'text-[#1A2CB5] border-[#1A2CB5]' : 'text-gray-500 border-transparent hover:text-black'}`}>Paramètres Profil</button>
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-2 pb-3 flex-shrink-0 ml-8">
              <LogOut size={16} /> <span className="hidden md:inline">Quitter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* =========================================
            ONGLET : ANALYTIQUES & VENTES (SHOPIFY) 
           ========================================= */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
             
             {/* Section 1 : Chiffre d'Affaires Global */}
             <div className="bg-[#1A2CB5] text-white rounded-3xl p-8 relative overflow-hidden shadow-xl border border-blue-900">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <div className="font-bold text-blue-200 text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Banknote size={16} /> Chiffre d'affaires brut généré (Mois Actuel)
                  </div>
                  <div className="flex items-baseline gap-3">
                     <span className="text-5xl md:text-6xl font-black">{totalRevenue.toLocaleString('fr-FR')}</span>
                     <span className="text-2xl font-bold text-blue-200">FCFA</span>
                  </div>
                  <div className="mt-6 flex gap-8">
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <div className="text-xs text-blue-200 font-bold uppercase mb-1">Ventes Actives</div>
                      <div className="text-xl font-black">{orders.length} <span className="text-sm font-medium">B2B</span></div>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                      <div className="text-xs text-blue-200 font-bold uppercase mb-1">En Séquestre</div>
                      <div className="text-xl font-black">{totalRevenue.toLocaleString('fr-FR')} <span className="text-sm font-medium">XOF</span></div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Section 2 : Trafic et Acquisition */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <Eye size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">+14% <ArrowUpRight size={12}/></span>
                  </div>
                  <h4 className="text-gray-500 font-medium text-sm mb-1">Vues organiques</h4>
                  <div className="text-3xl font-black text-gray-900">{viewsSimulated.toLocaleString('fr-FR')}</div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <Target size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">+5% <ArrowUpRight size={12}/></span>
                  </div>
                  <h4 className="text-gray-500 font-medium text-sm mb-1">Clics sur annonces</h4>
                  <div className="text-3xl font-black text-gray-900">{clicksSimulated.toLocaleString('fr-FR')}</div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                      <ShoppingBag size={20} />
                    </div>
                  </div>
                  <h4 className="text-gray-500 font-medium text-sm mb-1">Paniers Abandonnés</h4>
                  <div className="text-3xl font-black text-gray-900">{abandonedCartSimulated}</div>
                  <p className="text-xs text-orange-600 mt-2 font-medium">Relance marketing conseillée</p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </div>

                <div className="bg-[#f8f9fa] border border-gray-200 p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="text-gray-400" size={20} />
                    <h4 className="font-bold text-gray-900">Trafic Pays B2B</h4>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-xs font-bold mb-1"><span>Côte d'Ivoire</span> <span className="text-gray-500">65%</span></div>
                       <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-[65%] h-full bg-[#1A2CB5]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-xs font-bold mb-1"><span>Cameroun</span> <span className="text-gray-500">20%</span></div>
                       <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-[20%] h-full bg-[#1A2CB5]"></div></div>
                     </div>
                     <div>
                       <div className="flex justify-between text-xs font-bold mb-1"><span>Sénégal</span> <span className="text-gray-500">15%</span></div>
                       <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-[15%] h-full bg-[#1A2CB5]"></div></div>
                     </div>
                  </div>
                </div>

             </div>

             {/* Répartition des Commandes */}
             {orders.length > 0 && (
               <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                 <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2"><CheckCircle2 className="text-green-500"/> Pipeline de commandes (Séquestre)</h3>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left font-medium text-sm">
                     <thead>
                       <tr className="text-gray-400 border-b border-gray-100">
                         <th className="pb-3 px-4">Commande ID</th>
                         <th className="pb-3 px-4">Date</th>
                         <th className="pb-3 px-4">Client ID</th>
                         <th className="pb-3 px-4">Statut</th>
                         <th className="pb-3 px-4 text-right">Montant Revenant</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {orders.map(order => {
                         const itemsAmount = order.vendorSpecificItems.reduce((acc: number, item: any) => acc + (item.priceValue * item.quantity), 0);
                         const isDelivered = order.status === 'delivered_by_vendor' || order.status === 'completed';
                         
                         return (
                           <tr key={order.id} className="hover:bg-gray-50/50">
                             <td className="py-4 px-4 font-bold text-gray-900">CMD-{order.id.substring(0,6).toUpperCase()}</td>
                             <td className="py-4 px-4 text-gray-500">Aujourd'hui</td>
                             <td className="py-4 px-4 text-gray-500">{order.buyerId.substring(0,8)}...</td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${order.status === 'funds_locked' ? 'bg-orange-100 text-orange-600' : isDelivered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {order.status === 'funds_locked' ? 'À Livrer' : order.status === 'delivered_by_vendor' ? 'Livré (Attente Client)' : order.status}
                                </span>
                              </td>
                             <td className="py-4 px-4 text-right font-black text-[#1A2CB5]">{itemsAmount.toLocaleString('fr-FR')} FCFA</td>
                              <td className="py-4 px-4 flex gap-2 justify-end">
                                 <button onClick={() => navigate(`/boutique/facture/${order.id}`)} className="p-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-colors" title="Accéder à la facture">
                                    <FileText size={16} />
                                 </button>
                                 <button onClick={() => navigate(`/messages/nouveau?to=${order.buyerId}&order=${order.id}`)} className="p-2 text-[#1A2CB5] bg-blue-50 rounded-lg hover:bg-[#1A2CB5] hover:text-white transition-colors" title="Contacter l'acheteur">
                                    <MessageSquare size={16} />
                                 </button>
                                 {!isDelivered && (
                                   <button onClick={() => setSelectedOrderForDelivery(order)} className="bg-[#1A2CB5] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                     Valider Livraison
                                   </button>
                                 )}
                              </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* =========================================
            ONGLET : ANNONCES
           ========================================= */}
        {activeTab === 'ads' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="font-black text-gray-900 text-lg flex items-center gap-2"><Box className="text-[#1A2CB5]"/> Vos Produits & Services ({listings.length})</h2>
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                   <input type="text" placeholder="Rechercher une annonce..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#1A2CB5] text-sm" />
                </div>
              </div>
              
              {listings.length === 0 ? (
                <div className="p-16 text-center text-gray-500 bg-gray-50/30">
                  <Box size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-black text-gray-900 mb-2">Catalogue Vide</h3>
                  <p className="max-w-md mx-auto mb-8 font-medium">Vous n'avez pas encore publié de produit ou service. Cliquez sur le bouton pour étoffer votre catalogue B2B.</p>
                  <Link to="/vendeur/nouvelle-annonce" className="inline-block bg-[#1A2CB5] text-white px-8 py-4 rounded-xl font-black hover:bg-black transition-colors shadow-lg shadow-blue-500/30">Déposer une annonce maintenant</Link>
                </div>
              ) : (
                <div className="overflow-x-auto w-full p-4">
                   {/* Grille Style Shopify */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {listings.map(item => (
                       <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] hover:shadow-xl hover:border-gray-200 transition-all bg-white flex flex-col group">
                         <div className="h-48 bg-gray-100 relative overflow-hidden">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute top-2 left-2 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm flex items-center gap-1">
                             <CheckCircle2 size={10} /> En Ligne
                           </div>
                         </div>
                         <div className="p-4 flex flex-col flex-1">
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 truncate">{item.category}</div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight mb-3 line-clamp-2">{item.title}</h3>
                            <div className="mt-auto">
                               <div className="text-xl font-black text-[#1A2CB5] mb-4">{Number(item.priceValue).toLocaleString('fr-FR')} <span className="text-xs">FCFA</span></div>
                               
                               <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                 {item.modificationsCount >= 1 ? (
                                   <button disabled className="flex-1 py-2 text-xs font-bold text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed">Édité 1/1</button>
                                 ) : (
                                   <button className="flex-1 py-2 text-xs font-bold text-[#1A2CB5] bg-blue-50 rounded-lg hover:bg-[#1A2CB5] hover:text-white transition-colors">Modifier</button>
                                 )}
                                 <button className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Supprimer">
                                   <Trash2 size={16} />
                                 </button>
                               </div>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================
            ONGLET : PORTEFEUILLE VENDEUR 
           ========================================= */}
        {activeTab === 'wallet' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto space-y-6">
             <div className="bg-gradient-to-br from-[#1A2CB5] to-black p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div>
                     <div className="text-blue-200 font-bold tracking-widest text-sm uppercase mb-2">Solde Sécurisé Disponible</div>
                     <div className="text-5xl md:text-7xl font-black">{totalRevenue.toLocaleString('fr-FR')} <span className="text-2xl text-blue-200">FCFA</span></div>
                     <p className="text-sm mt-4 text-gray-300 max-w-sm font-medium leading-relaxed">Fonds bloqués dans le séquestre Freeman Group en attente de livraison. Vos fonds sont 100% sécurisés.</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center">
                      <button onClick={() => toast.success("Demande de retrait transférée au service financier de Freeman Group. Traitement en 48H.")} disabled={totalRevenue === 0} className="bg-white text-black px-8 py-4 rounded-xl font-black w-full hover:bg-green-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2">
                        Demander un Retrait
                      </button>
                      <div className="text-[10px] text-blue-100 font-medium uppercase tracking-widest">Frais bancaires applicables (2%)</div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Historique des Retraits</h3>
                <div className="text-center py-10 text-gray-400 font-medium bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  Aucun retrait demandé pour le moment.
                </div>
             </div>
          </div>
        )}

        {/* =========================================
            ONGLET : PARAMETRES (Existant)
           ========================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="col-span-1">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 relative flex items-center justify-center text-gray-300 border-4 border-gray-50">
                  <User size={64} />
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#1A2CB5] text-white rounded-full flex items-center justify-center hover:bg-black transition-colors shadow-lg border-4 border-white">
                    <Camera size={16} />
                  </button>
                </div>
                <h3 className="font-black text-2xl text-gray-900">{userData?.name}</h3>
                <p className="text-gray-500 text-sm mb-6 font-medium">{user.email}</p>
                
                <div className="text-left bg-gray-50 p-5 rounded-2xl text-sm mb-6 border border-gray-100">
                  <div className="flex justify-between font-bold text-gray-700 mb-2"><span>Statut</span> <span className="uppercase text-green-600 font-black"><CheckCircle2 size={14} className="inline mr-1"/>Vérifié</span></div>
                  <div className="flex justify-between font-bold text-gray-700 mb-2"><span>Type</span> <span className="uppercase text-[#d4af37]">B2B Elite</span></div>
                  <div className="flex justify-between text-gray-500 font-medium"><span>Inscription</span> <span>2026</span></div>
                </div>

                <button onClick={() => toast.error("Procédure de validation requise pour suppression B2B.")} className="w-full py-3.5 border-2 border-red-50 text-red-500 font-bold rounded-xl hover:bg-red-50 hover:border-red-100 transition-colors flex items-center justify-center gap-2">
                  <Trash2 size={18} /> Supprimer le compte
                </button>
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2 space-y-6">
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 text-[#1A2CB5] rounded-xl flex items-center justify-center"><Settings /></div>
                    <h3 className="text-2xl font-black text-gray-900">Informations Entreprise</h3>
                  </div>

                  <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success("Les informations ont été mises à jour !"); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Raison Sociale</label>
                        <input type="text" defaultValue={userData?.name} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-4 focus:ring-[#1A2CB5]/10 outline-none font-bold text-gray-900 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Contact Téléphonique Pro</label>
                        <input type="tel" placeholder="+229..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-4 focus:ring-[#1A2CB5]/10 outline-none font-bold text-gray-900 transition-all" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Adresse Email (Admin)</label>
                      <input type="email" defaultValue={user.email || ''} className="w-full px-5 py-4 bg-gray-100 border border-transparent rounded-xl outline-none font-bold text-gray-500 cursor-not-allowed" disabled />
                      <p className="text-xs text-gray-400 mt-2 font-medium">Géré par Freeman ID Security.</p>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">🔗 Sécurité du compte</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <input type="password" placeholder="Nouveau mot de passe" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-4 focus:ring-[#1A2CB5]/10 outline-none transition-all font-medium" />
                        </div>
                        <div>
                          <input type="password" placeholder="Confirmer le mot de passe" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#1A2CB5] focus:ring-4 focus:ring-[#1A2CB5]/10 outline-none transition-all font-medium" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 mt-4 gap-4 items-center">
                      <div className="flex items-center gap-2 mr-auto bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                        <span className="text-sm font-bold text-[#1A2CB5]">Collecter la TVA Béninoise (18%)</span>
                        <button 
                          type="button"
                          onClick={handleToggleVat}
                          className={`w-12 h-6 rounded-full transition-colors relative ${isVatEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isVatEnabled ? 'left-7' : 'left-1'}`}></div>
                        </button>
                      </div>
                      <button type="submit" className="bg-[#1A2CB5] text-white px-10 py-4 rounded-xl font-black hover:bg-black transition-colors shadow-lg shadow-[#1A2CB5]/30">
                        Sauvegarder les modifications
                      </button>
                    </div>
                  </form>
               </div>
            </div>
          </div>
        )}

        {/* MODAL VALIDATION LIVRAISON */}
        {selectedOrderForDelivery && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="bg-[#1A2CB5] p-6 text-white">
                <h3 className="text-xl font-black">Preuve de Livraison - CMD-{selectedOrderForDelivery.id.substring(0,6).toUpperCase()}</h3>
                <p className="text-blue-100 text-xs mt-1">Fournissez les preuves documentaires pour protéger votre paiement.</p>
              </div>
              <form onSubmit={handleValidateDelivery} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">1. Facture payée & Reçu</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1A2CB5] transition-colors">
                      <Camera size={24} className="mx-auto text-gray-300 mb-1" />
                      <span className="text-[10px] font-bold text-gray-400">Cliquez pour uploader le PDF/Image</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">2. Bon de livraison signé</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1A2CB5] transition-colors">
                      <Edit3 size={24} className="mx-auto text-gray-300 mb-1" />
                      <span className="text-[10px] font-bold text-gray-400">Signature client obligatoire</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">3. Photo du colis à destination</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#1A2CB5] transition-colors">
                      <Camera size={24} className="mx-auto text-gray-300 mb-1" />
                      <span className="text-[10px] font-bold text-gray-400">Preuve visuelle de la remise</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setSelectedOrderForDelivery(null)} className="flex-1 py-4 font-bold text-gray-500 hover:text-black transition-colors">Annuler</button>
                  <button type="submit" disabled={isValidatingDelivery} className="flex-1 py-4 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                    {isValidatingDelivery ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Valider la remise</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
