import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, increment } from 'firebase/firestore';
import { 
  User, Package, Wallet, Bell, LogOut, 
  Loader2, ShieldCheck, Clock, Truck, 
  CheckCircle2, Eye, AlertCircle, CreditCard, 
  Smartphone, Banknote, FileText, Image as ImageIcon, Download, BellRing, Settings, Trash2,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';

import { MessagesPage } from './MessagesPage';
import { MARKETPLACE_CATEGORIES } from '../data/marketplaceCategories';

export function CustomerDashboardPage() {
  const { user, userData, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wallet' | 'alerts' | 'messages'>(
    (tabParam as any) || 'orders'
  );

  useEffect(() => {
    if (tabParam && ['profile', 'orders', 'wallet', 'alerts', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const [loading, setLoading] = useState(true);

  // Valeurs Portefeuille
  const [balance, setBalance] = useState(0);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('momo');
  
  // Valeurs Commandes
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [confirmingReceipt, setConfirmingReceipt] = useState(false);

  const [alerts, setAlerts] = useState<any[]>([
     { id: '1', keyword: 'Groupe électrogène', category: 'materiel-pro', maxPrice: 5000000, viaEmail: true, viaSms: false, condition: 'any', brand: '' }
  ]);
  const [newAlertKw, setNewAlertKw] = useState('');
  const [newAlertPrice, setNewAlertPrice] = useState('');
  const [newAlertCat, setNewAlertCat] = useState('');
  const [newAlertBrand, setNewAlertBrand] = useState('');
  const [newAlertCondition, setNewAlertCondition] = useState<'new' | 'used' | 'any'>('any');

  // SÉCURITÉ ET CHARGEMENT INITIAL (Wait for Auth Loading)
  useEffect(() => {
    if (!authLoading && (!user || userData?.role === 'vendor')) {
      navigate('/connexion');
    }
  }, [user, userData, authLoading, navigate]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    // 1. Charger le solde
    const fetchBalance = async () => {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setBalance(docSnap.data().walletBalance || 0);
    };

    // 2. Charger les commandes
    const q = query(collection(db, 'orders'), where("buyerId", "==", user.uid));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedOrders.sort((a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setOrders(fetchedOrders);
      setLoading(false);
    });

    fetchBalance();

    return () => unsubscribeOrders();
  }, [user]);

  // ACTIONS 
  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success("Vous êtes déconnecté.");
  };

  const handleSimulateTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const amountNum = Number(topupAmount);
    if (!amountNum || amountNum <= 0) return toast.error("Montant invalide.");
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { walletBalance: balance + amountNum });
      setBalance(b => b + amountNum);
      setShowTopupModal(false);
      setTopupAmount('');
      toast.success(`Portefeuille crédité de ${amountNum.toLocaleString('fr-FR')} FCFA`);
    } catch (e) {
      toast.error("Erreur de rechargement.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (order: any) => {
    if (!window.confirm("Avez-vous bien reçu tous les articles ? Les fonds seront débloqués pour le vendeur.")) return;
    setConfirmingReceipt(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: 'completed', completedAt: new Date().toISOString() });
      for (const item of order.items) {
        const itemTotal = item.priceValue * item.quantity;
        await updateDoc(doc(db, 'users', item.vendorId), { walletBalance: increment(itemTotal) });
      }
      toast.success("Confirmation validée. Fonds libérés.");
      setSelectedOrder(null);
    } catch (e) {
      toast.error("Erreur de confirmation.");
    } finally {
      setConfirmingReceipt(false);
    }
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertKw && !newAlertCat) return toast.error("Veuillez saisir au moins un mot-clé ou une catégorie.");
    
    const newAlert = { 
      id: Date.now().toString(), 
      keyword: newAlertKw, 
      category: newAlertCat,
      brand: newAlertBrand,
      condition: newAlertCondition,
      maxPrice: Number(newAlertPrice), 
      viaEmail: true, 
      viaSms: true 
    };
    
    setAlerts([...alerts, newAlert]);
    setNewAlertKw(''); 
    setNewAlertPrice('');
    setNewAlertCat('');
    setNewAlertBrand('');
    setNewAlertCondition('any');
    toast.success("Alerte ultra-personnalisée ajoutée !");
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.info("Alerte supprimée.");
  };

  if (authLoading || (loading && !showTopupModal)) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1A2CB5]" size={48}/></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-2 sticky top-28">
            <div className="text-center mb-6">
               <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-gray-400 mb-4 border border-gray-200">
                  <User size={32} />
               </div>
               <h2 className="font-black text-gray-900 truncate px-2">{userData?.name || "Client B2B"}</h2>
               <span className="bg-[#1A2CB5]/10 text-[#1A2CB5] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 inline-block border border-[#1A2CB5]/20">ID: {user.uid.substring(0,8).toUpperCase()} • CLIENT</span>
            </div>

            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'orders' ? 'bg-[#1A2CB5] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
               <Package size={20} /> Mes Achats
            </button>
            <button onClick={() => setActiveTab('wallet')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'wallet' ? 'bg-[#1A2CB5] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
               <Wallet size={20} /> Portefeuille
            </button>
            <button onClick={() => setActiveTab('alerts')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'alerts' ? 'bg-[#1A2CB5] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
               <BellRing size={20} /> Mes Alertes
            </button>
            <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'messages' ? 'bg-[#1A2CB5] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
               <MessageCircle size={20} /> Messagerie
            </button>
            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#1A2CB5] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
               <Settings size={20} /> Mon Profil
            </button>
            
            <div className="w-full h-px bg-gray-100 my-2"></div>
            
            <Link to="/boutique" className="flex items-center gap-3 p-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
               <Eye size={20} /> Retour Boutique
            </Link>

            <button onClick={handleLogout} className="flex items-center gap-3 p-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-colors mt-auto">
               <LogOut size={20} /> Déconnexion
            </button>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="col-span-1 md:col-span-3">
          
          {/* ACHATS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Package className="text-[#1A2CB5]"/> Historique d'achats Escrow</h1>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
                  <Clock className="mx-auto text-gray-300 mb-4" size={48} />
                  <h2 className="text-xl font-bold text-gray-900">Aucune commande</h2>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 border-l-8 border-l-[#1A2CB5]">
                      <div className="md:w-1/3 border-r border-gray-50 pr-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3" style={{ backgroundColor: order.status === 'funds_locked' ? '#FFF7ED' : order.status === 'delivered_by_vendor' ? '#F0FDF4' : '#F3F4F6', color: order.status === 'funds_locked' ? '#C2410C' : order.status === 'delivered_by_vendor' ? '#15803D' : '#374151' }}>
                          {order.status === 'funds_locked' && <><Clock size={12}/> Envoi en attente</>}
                          {order.status === 'delivered_by_vendor' && <><Truck size={12}/> À Valider</>}
                          {order.status === 'completed' && <><CheckCircle2 size={12}/> Terminé</>}
                        </div>
                        <h4 className="font-black text-gray-900 mb-1">CMD-{order.id.substring(0,8).toUpperCase()}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase">{new Date(order.createdAt?.toMillis()).toLocaleDateString()}</p>
                        
                        <div className="mt-4 space-y-2">
                          <button onClick={() => setSelectedOrder(order)} className="w-full py-2 bg-gray-50 text-gray-700 font-bold justify-center rounded-xl hover:bg-gray-100 flex items-center gap-2 text-xs border border-gray-100">
                            <Eye size={14} /> Détails & Preuves
                          </button>
                          {order.status === 'delivered_by_vendor' && (
                            <button onClick={() => handleConfirmReceipt(order)} disabled={confirmingReceipt} className="w-full py-2 bg-[#1A2CB5] text-white font-bold justify-center rounded-xl hover:bg-black flex items-center gap-2 text-xs">
                              {confirmingReceipt ? <Loader2 className="animate-spin" size={14} /> : "Confirmer Réception"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <div className="flex gap-4 overflow-x-auto pb-4">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex-shrink-0 w-48 bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 items-center">
                              <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-gray-900 truncate">{item.title}</p>
                                <p className="text-[9px] font-bold text-gray-500 uppercase">{item.quantity} x {item.priceValue} FCFA</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase">NET PAYÉ (TTC)</p>
                          <p className="text-xl font-black text-[#1A2CB5]">{order.totalAmount.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PORTEFEUILLE TAB */}
          {activeTab === 'wallet' && (
            <div className="animate-in fade-in space-y-6">
              <div className="bg-[#1A2CB5] p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-blue-200 font-bold uppercase tracking-widest text-xs mb-2">Solde Rechargeable</p>
                    <h2 className="text-5xl font-black">{balance.toLocaleString()} <span className="text-2xl text-blue-200">FCFA</span></h2>
                  </div>
                  <button onClick={() => setShowTopupModal(true)} className="bg-white text-black font-black px-8 py-4 rounded-xl hover:bg-green-400 hover:text-white transition-colors">
                    Faire un Dépôt
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <ShieldCheck size={32} className="text-green-500" />
                  <div>
                    <h3 className="font-bold text-gray-900">Paiement 100% Sécurisé</h3>
                    <p className="text-xs text-gray-500 mt-1">L'argent de votre portefeuille est prélevé au moment de l'achat et séquestré jusqu'à livraison vérifiée.</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
                   <Banknote size={32} className="text-blue-500" />
                   <div>
                     <h3 className="font-bold text-gray-900">Gros volumes garantis</h3>
                     <p className="text-xs text-gray-500 mt-1">Frais réduits sur les Virement Bancaires B2B pour les montants &gt; à 5 000 000 FCFA.</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* ALERTES TAB */}
          {activeTab === 'alerts' && (
            <div className="animate-in fade-in space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#1A2CB5]"><BellRing size={24}/></div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Alertes d'Approvisionnement</h2>
                    <p className="text-sm font-medium text-gray-500">Soyez notifié (Email/SMS) dès qu'un équipement correspondant à vos critères est mis en ligne.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveAlert} className="bg-gray-50 p-6 rounded-2xl space-y-4 mb-8 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="w-full">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Mots-clés (Ex: Solaire, PC...)</label>
                      <input type="text" value={newAlertKw} onChange={e=>setNewAlertKw(e.target.value)} placeholder="Que cherchez-vous ?" className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1A2CB5] text-sm font-medium" />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Catégorie cible</label>
                      <select value={newAlertCat} onChange={e=>setNewAlertCat(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1A2CB5] text-sm font-medium bg-white">
                        <option value="">Toutes les catégories</option>
                        {MARKETPLACE_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Budget Maxi (FCFA)</label>
                      <input type="number" value={newAlertPrice} onChange={e=>setNewAlertPrice(e.target.value)} placeholder="Illimité" className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1A2CB5] text-sm font-medium" />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Marque / Fabricant</label>
                      <input type="text" value={newAlertBrand} onChange={e=>setNewAlertBrand(e.target.value)} placeholder="Ex: Toyota, Apple..." className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#1A2CB5] text-sm font-medium" />
                    </div>
                    <div className="w-full">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">État du matériel</label>
                      <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl">
                        {(['any', 'new', 'used'] as const).map(c => (
                          <button 
                            key={c}
                            type="button"
                            onClick={() => setNewAlertCondition(c)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${newAlertCondition === c ? 'bg-[#1A2CB5] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            {c === 'any' ? 'Peu importe' : c === 'new' ? 'Neuf' : 'Occasion'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button type="submit" className="bg-[#1A2CB5] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black w-full h-[50px] transition-all flex items-center justify-center gap-2">
                         Activer l'Alerte Libérée
                      </button>
                    </div>
                  </div>
                </form>

                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2">Vos alertes actives ({alerts.length})</h3>
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl">
                       <div className="mb-2 sm:mb-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-gray-900">{alert.keyword || 'Tous produits'}</span>
                            {alert.category && (
                              <span className="bg-blue-50 text-[#1A2CB5] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                                {MARKETPLACE_CATEGORIES.find(c => c.id === alert.category)?.name || alert.category}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 items-center">
                            <p className="text-[10px] uppercase font-bold text-gray-500">
                              <span className="text-[#1A2CB5]">Max {alert.maxPrice ? alert.maxPrice.toLocaleString()+' FCFA' : 'Illimité'}</span>
                            </p>
                            <span className="text-gray-300">|</span>
                            {alert.brand && <span className="text-[10px] font-black text-gray-700 flex items-center gap-1 uppercase tracking-tighter">🏷️ {alert.brand}</span>}
                            <span className="text-[10px] font-black text-gray-700 flex items-center gap-1 uppercase tracking-tighter">
                              ✨ {alert.condition === 'any' ? 'États variés' : alert.condition === 'new' ? 'Neuf uniquement' : 'Occasion'}
                            </span>
                          </div>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={()=>deleteAlert(alert.id)} className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="animate-in fade-in space-y-6 flex flex-col h-[75vh]">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex-shrink-0">
                <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><MessageCircle className="text-[#1A2CB5]"/> Messagerie Privée</h1>
              </div>
              <div className="flex-1 overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm relative">
                <MessagesPage embedded={true} />
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Paramètres du Compte</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nom de l'entreprise ou contact</label>
                  <input type="text" readOnly value={userData?.name || ''} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                  <input type="email" readOnly value={user?.email || ''} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl" />
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100">
                <h3 className="font-bold text-red-500 mb-2">Zone de Danger</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">La clôture de votre compte entraînera la perte définitive de votre portefeuille et historique d'achats.</p>
                <button onClick={() => toast.info("Un email de confirmation vous a été envoyé.")} className="px-6 py-3 border-2 border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50">
                  Demander la clôture du compte
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* MODAL RECHARGEMENT SIMULAIRE A CUSTOMERWALLETPAGE */}
      {showTopupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
             <h2 className="text-2xl font-black text-gray-900 mb-6">Recharger</h2>
             <form onSubmit={handleSimulateTopup}>
               <div className="mb-6">
                 <input type="number" min="5000" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} placeholder="Montant en FCFA" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#1A2CB5] text-xl font-black text-center" required />
               </div>
               <div className="flex gap-4">
                 <button type="button" onClick={() => setShowTopupModal(false)} className="w-1/3 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl">Annuler</button>
                 <button type="submit" disabled={loading} className="flex-1 bg-[#1A2CB5] text-white font-black py-4 rounded-xl hover:bg-black">Valider</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL DÉTAILS COMMANDE (RÉDUITE POUR L'EXEMPLE) */}
      {selectedOrder && (
         <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#1A2CB5] p-6 text-white flex justify-between items-center">
                 <h3 className="text-xl font-black">Preuves CMD-{selectedOrder.id.substring(0,6)}</h3>
                 <button onClick={()=>setSelectedOrder(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/30"><LogOut size={20}/></button>
              </div>
              <div className="p-8 space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 text-sm">Le vendeur a uploadé : Facture, Bon de livraison signé.</p>
                  <p className="text-xs text-gray-500 mt-2">Vous devez valider la réception physique pour débloquer les fonds Escrow.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                   <button onClick={() => navigate(`/boutique/facture/${selectedOrder.id}`)} className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-xl flex justify-center items-center gap-2"><FileText size={18}/>Voir Facture</button>
                   <button onClick={() => navigate(`/messages/nouveau?to=${selectedOrder.items[0].vendorId}&order=${selectedOrder.id}`)} className="flex-1 py-4 border-2 border-gray-200 text-gray-900 font-bold rounded-xl flex justify-center items-center gap-2"><AlertCircle size={18}/>Signaler Litige</button>
                </div>
              </div>
            </div>
         </div>
      )}
    </div>
  );
}
