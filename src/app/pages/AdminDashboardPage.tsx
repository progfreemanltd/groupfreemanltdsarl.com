import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { db, firebaseConfig } from '../../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { ShieldAlert, Users, CheckCircle, XCircle, Banknote, ShieldCheck, Box, Search, AlertTriangle, UserCog, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboardPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('moderation');
  
  // Données
  const [usersList, setUsersList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Création Utilisateur
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', role: 'customer' });

  // Securité & Autorisations
  const role = userData?.role;
  const isSuperAdmin = role === 'super_admin';
  const canModerate = isSuperAdmin || role === 'moderator';
  const canFinance = isSuperAdmin || role === 'finance';
  const canManageUsers = isSuperAdmin || role === 'fraud';

  useEffect(() => {
    if (authLoading) return;
    
    // Si pas connecté du tout
    if (!user) {
      navigate('/connexion');
      return;
    }

    // Si l'utilisateur n'est pas admin, il dégage
    if (userData && !['super_admin', 'moderator', 'finance', 'fraud'].includes(role || '')) {
      navigate('/boutique');
      toast.error('Accès restreint. Espace réservé à l\'équipe Freeman.');
    }
  }, [userData, role, navigate, authLoading, user]);

  useEffect(() => {
    if (!user || !role) return;

    // Récupération des Utilisateurs (Super Admin / Fraud)
    let unsubUsers = () => {};
    if (canManageUsers || isSuperAdmin) {
      unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
        setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    // Récupération des Produits (Super Admin / Moderator)
    let unsubProducts = () => {};
    if (canModerate) {
      unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
        setProductsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    // Récupération des Commandes & Retraits (Super Admin / Finance)
    let unsubOrders = () => {};
    if (canFinance) {
      unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
        setOrdersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    }

    setLoading(false);

    return () => { unsubUsers(); unsubProducts(); unsubOrders(); };
  }, [user, role, canManageUsers, canModerate, canFinance, isSuperAdmin]);

  // Actions
  const handleUpdateProductStatus = async (productId: string, newStatus: 'active' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'products', productId), { status: newStatus });
      toast.success(`Statut du produit mis à jour: ${newStatus === 'active' ? 'Validé' : 'Rejeté'}`);
    } catch(e) { console.error(e); toast.error("Erreur de mise à jour"); }
  };

  const handleChangeUserRole = async (userId: string, newRole: string) => {
    if (!isSuperAdmin) return toast.error("Seul le Super Admin peut modifier les rôles.");
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      toast.success(`Rôle de l'utilisateur mis à jour (${newRole})`);
    } catch(e) { console.error(e); toast.error("Erreur"); }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      toast.success(`Statut du séquestre mis à jour: ${newStatus}`);
    } catch(e) { console.error(e); toast.error("Erreur"); }
  };

  const handleResolveDispute = async (order: any, action: 'refund' | 'release') => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action === 'refund' ? 'rembourser' : 'libérer'} cette commande ? Cette action est irréversible.`)) return;
    
    try {
      if (action === 'refund') {
        // Rembourser l'acheteur
        const buyerRef = doc(db, 'users', order.buyerId);
        await updateDoc(buyerRef, {
          walletBalance: increment(order.totalAmount)
        });
        await updateDoc(doc(db, 'orders', order.id), { status: 'refunded', resolvedAt: new Date().toISOString() });
        toast.success("Commande remboursée avec succès.");
      } else {
        // Libérer au vendeur
        for (const item of order.items) {
          const vendorRef = doc(db, 'users', item.vendorId);
          await updateDoc(vendorRef, {
            walletBalance: increment(item.priceValue * item.quantity)
          });
        }
        await updateDoc(doc(db, 'orders', order.id), { status: 'completed', resolvedAt: new Date().toISOString() });
        toast.success("Fonds libérés au vendeur avec succès.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la résolution du litige.");
    }
  };

  const handleUpdateUserStatus = async (userId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: newStatus });
      toast.success(newStatus === 'active' ? "Vendeur validé avec succès !" : "Compte suspendu.");
    } catch(e) { console.error(e); toast.error("Erreur lors de la mise à jour du statut."); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageUsers) return toast.error("Accès refusé.");
    setIsCreatingUser(true);
    try {
      const secondaryApp = initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: 'active',
        createdAt: new Date().toISOString(),
        walletBalance: 0
      });
      
      await firebaseSignOut(secondaryAuth);
      
      toast.success("Utilisateur créé avec succès !");
      setNewUser({ email: '', password: '', name: '', role: 'customer' });
    } catch(err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la création.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (!user || loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-black" size={48}/></div>;

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen flex text-sm flex-col md:flex-row font-sans">
      
      {/* Sidebar Admin */}
      <div className="w-full md:w-64 bg-black text-white p-6 flex flex-col shadow-2xl z-20">
         <div className="mb-10 text-center">
            <Link to="/"><img src="/logo.png" alt="Freeman" className="h-10 mx-auto brightness-0 invert opacity-90 mb-4" /></Link>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Portail de Gestion</div>
            <div className="text-xl font-black text-white">{isSuperAdmin ? 'Super Admin' : `Accès: ${role?.toUpperCase()}`}</div>
         </div>
         
         <div className="space-y-4 flex-1">
            {canModerate && (
              <button onClick={() => setActiveTab('moderation')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'moderation' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                <ShieldCheck size={20} /> Modération Annonces
              </button>
            )}
            {canFinance && (
              <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'finance' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                <Banknote size={20} /> Escrow & Finance
              </button>
            )}
            {canManageUsers && (
              <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'users' ? 'bg-[#1A2CB5] text-white' : 'text-gray-400 hover:bg-white/10'}`}>
                <Users size={20} /> Base Utilisateurs
              </button>
            )}
            {isSuperAdmin && (
              <button onClick={() => setActiveTab('roles')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors font-bold ${activeTab === 'roles' ? 'bg-[#d4af37] text-black' : 'text-gray-400 hover:bg-white/10'}`}>
                <UserCog size={20} /> Gestion des Rôles
              </button>
            )}
         </div>

         <div className="mt-auto pt-6 border-t border-white/10 text-center">
            <div className="text-xs text-gray-400 mb-4">Connecté en tant que<br/><strong className="text-white">{userData?.name || user.email}</strong></div>
            <Link to="/boutique" className="text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">Retour Boutique</Link>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto w-full">
         
         {/* =======================
             ONGLET MODÉRATION
            ======================= */}
         {activeTab === 'moderation' && canModerate && (
           <div className="animate-in fade-in duration-300">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
               <div>
                  <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><ShieldCheck className="text-[#1A2CB5]"/> Centre de Modération</h1>
                  <p className="text-gray-500 font-medium mt-1">Validez ou rejetez les annonces B2B (Maintien de la qualité).</p>
               </div>
               <div className="bg-white p-2 rounded-lg border border-gray-200 text-center font-bold px-6 shadow-sm"><span className="text-[#1A2CB5] text-xl">{productsList.filter(p => !p.status || p.status === 'pending' || p.status === 'pending_approval').length}</span><br/><span className="text-[10px] text-gray-400 uppercase tracking-widest">En attente</span></div>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {productsList.filter(p => !p.status || p.status === 'pending' || p.status === 'pending_approval').map(product => (
                 <div key={product.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 lg:items-center">
                    <img src={product.image} className="w-32 h-32 object-cover rounded-xl bg-gray-100" alt={product.title} />
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-[#1A2CB5] uppercase tracking-widest mb-1">{product.category}</div>
                       <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
                       <p className="text-gray-500 text-sm mt-2 font-medium">Prix: {Number(product.priceValue).toLocaleString('fr-FR')} {product.priceCurrency} <br/>Vendeur ID: {product.vendorId}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => handleUpdateProductStatus(product.id, 'active')} className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex flex-col items-center hover:bg-green-600 transition-colors shadow-sm">
                         <CheckCircle size={20} className="mb-1" /> VALIDER
                       </button>
                       <button onClick={() => handleUpdateProductStatus(product.id, 'rejected')} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold flex flex-col items-center hover:bg-red-100 transition-colors">
                         <XCircle size={20} className="mb-1" /> REJETER
                       </button>
                    </div>
                 </div>
               ))}
               {productsList.filter(p => !p.status || p.status === 'pending' || p.status === 'pending_approval').length === 0 && (
                 <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-300">Aucune annonce en attente de modération.</div>
               )}
             </div>

             {/* Historique Validé */}
             <h2 className="text-xl font-black mt-12 mb-6">Historique des annonces</h2>
             <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden text-sm">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b border-gray-100">
                   <tr>
                     <th className="p-4 font-bold text-gray-600">Produit</th>
                     <th className="p-4 font-bold text-gray-600">Statut Actuel</th>
                     <th className="p-4 font-bold text-gray-600">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {productsList.filter(p => p.status === 'active' || p.status === 'rejected').slice(0, 10).map(product => (
                     <tr key={product.id}>
                       <td className="p-4 font-bold text-gray-900">{product.title}</td>
                       <td className="p-4 font-medium">
                         {product.status === 'active' ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Actif Publié</span> : <span className="text-red-600 bg-red-50 px-2 py-1 rounded">Rejeté</span>}
                       </td>
                       <td className="p-4">
                         {product.status === 'active' && <button onClick={() => handleUpdateProductStatus(product.id, 'rejected')} className="text-red-500 hover:underline font-bold text-xs">Forcer le Rejet</button>}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}


         {/* =======================
             ONGLET ROLES (SUPER ADMIN)
            ======================= */}
         {activeTab === 'roles' && isSuperAdmin && (
           <div className="animate-in fade-in duration-300">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
               <div>
                  <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3"><UserCog className="text-[#d4af37]"/> Gestion des Délégations</h1>
                  <p className="text-gray-500 font-medium mt-1">Élevez des utilisateurs B2B existants en administrateurs métiers.</p>
               </div>
             </div>

             <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
               <div className="relative mb-6">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" placeholder="Rechercher par adresse email pour assigner un rôle..." className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] font-bold"/>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left bg-white">
                   <thead className="bg-[#f8f9fa] border-y border-gray-200 text-xs uppercase tracking-widest text-gray-500">
                     <tr>
                       <th className="p-4 font-bold">Email</th>
                       <th className="p-4 font-bold">Nom / Entreprise</th>
                       <th className="p-4 font-bold">Rôle Actuel</th>
                       <th className="p-4 font-bold">Actions de Délégation</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 font-medium text-sm">
                     {usersList.slice(0, 10).map(u => (
                       <tr key={u.id}>
                         <td className="p-4 text-gray-900">{u.email || u.id}</td>
                         <td className="p-4 text-gray-900">{u.name || '-'}</td>
                         <td className="p-4">
                           <span className={`px-3 py-1 rounded font-bold text-xs ${u.role === 'super_admin' ? 'bg-black text-[#d4af37]' : u.role === 'moderator' ? 'bg-blue-100 text-[#1A2CB5]' : 'bg-gray-100 text-gray-600'}`}>
                             {u.role || 'customer'}
                           </span>
                         </td>
                         <td className="p-4">
                           <select 
                             className="bg-white border border-gray-200 rounded-lg px-3 py-1 outline-none focus:border-[#d4af37]"
                             value={u.role || 'customer'}
                             onChange={(e) => handleChangeUserRole(u.id, e.target.value)}
                             disabled={u.role === 'super_admin'}
                           >
                             <option value="customer">Customer (B2C)</option>
                             <option value="vendor">Vendeur Pro</option>
                             <option value="moderator">Modérateur MKT</option>
                             <option value="finance">Finance / Escrow</option>
                             <option value="fraud">Analyste Fraude</option>
                           </select>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
         )}


         {/* ONGLET FINANCE (SIMPLIFIÉ POUR L'EXEMPLE) */}
         {activeTab === 'finance' && canFinance && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8"><Banknote className="text-green-600"/> Salle de Marché & Escrow</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#1A2CB5] text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="text-xs uppercase tracking-widest font-bold text-blue-200 mb-2">Volume Total Séquestré</div>
                  <div className="text-4xl font-black mb-4">
                    {ordersList.reduce((acc, order) => acc + (order.totalAmount || 0), 0).toLocaleString('fr-FR')} XOF
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-black text-gray-900">Médiation des Transactions (Séquestre)</h2>
                    <div className="flex gap-2">
                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {ordersList.filter(o => o.status === 'disputed').length} Litiges actifs
                      </span>
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-xs">
                     <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-widest border-b border-gray-100">
                       <tr>
                         <th className="p-4">ID / Date</th>
                         <th className="p-4">Acheteur</th>
                         <th className="p-4">Statut</th>
                         <th className="p-4">Preuves Vendeur</th>
                         <th className="p-4 text-right">Montant</th>
                         <th className="p-4 text-center">Actions de Médiation</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {ordersList.map(o => (
                         <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                           <td className="p-4">
                              <div className="font-bold text-gray-900">CMD-{o.id.substring(0,6).toUpperCase()}</div>
                              <div className="text-[10px] text-gray-400 font-medium">Aujourd'hui</div>
                           </td>
                           <td className="p-4">
                              <div className="font-medium text-gray-700">{o.buyerId.substring(0,8)}...</div>
                           </td>
                           <td className="p-4">
                              <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                                o.status === 'funds_locked' ? 'bg-orange-100 text-orange-700' :
                                o.status === 'delivered_by_vendor' ? 'bg-blue-100 text-blue-700' :
                                o.status === 'completed' ? 'bg-green-100 text-green-700' :
                                o.status === 'disputed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {o.status === 'funds_locked' ? 'Séquestré' : 
                                 o.status === 'delivered_by_vendor' ? 'Livré' :
                                 o.status === 'completed' ? 'Terminé' :
                                 o.status === 'disputed' ? '⚠️ LITIGE' : o.status}
                              </span>
                           </td>
                           <td className="p-4">
                              {o.vendorProofs ? (
                                <div className="flex gap-1">
                                  <div className="w-6 h-6 bg-green-50 text-green-600 rounded flex items-center justify-center border border-green-100" title="Facture ok"><ShieldCheck size={12}/></div>
                                  <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center border border-blue-100" title="Bon signé"><CheckCircle size={12}/></div>
                                  <div className="w-6 h-6 bg-orange-50 text-orange-600 rounded flex items-center justify-center border border-orange-100" title="Photo ok"><Box size={12}/></div>
                                </div>
                              ) : (
                                <span className="text-gray-300 italic">Aucune</span>
                              )}
                           </td>
                           <td className="p-4 text-right">
                              <div className="font-black text-[#1A2CB5]">{Number(o.totalAmount || 0).toLocaleString('fr-FR')} XOF</div>
                           </td>
                           <td className="p-4">
                              <div className="flex justify-center gap-2">
                                 {o.status !== 'completed' && o.status !== 'refunded' && (
                                   <>
                                     <button onClick={() => handleResolveDispute(o, 'release')} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-sm" title="Libérer les fonds (Médiation positive vendeur)">
                                       <CheckCircle size={14} />
                                     </button>
                                     <button onClick={() => handleResolveDispute(o, 'refund')} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-sm" title="Rembourser l'acheteur (Médiation positive client)">
                                       <XCircle size={14} />
                                     </button>
                                     <button onClick={() => handleUpdateOrderStatus(o.id, 'disputed')} className="bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-500 shadow-sm" title="Marquer comme LITIGE">
                                       <AlertTriangle size={14} />
                                     </button>
                                   </>
                                 )}
                              </div>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>
         )}

         {/* ONGLET UTILISATEURS / GESTION & MODÉRATION */}
         {activeTab === 'users' && canManageUsers && (
            <div className="animate-in fade-in duration-300 space-y-12">
              
              {/* FILE D'ATTENTE DE VALIDATION */}
              <div>
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 mb-8">
                  <ShieldCheck className="text-orange-500"/> Vendeurs en attente de vérification
                </h1>
                <div className="grid grid-cols-1 gap-4">
                  {usersList.filter(u => u.status === 'pending' && u.role === 'vendor').map(vendor => (
                    <div key={vendor.id} className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                       <div>
                         <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
                         <div className="text-gray-500 text-sm mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
                           <p><strong>IFU :</strong> <span className="font-mono">{vendor.ifu || 'Non renseigné'}</span></p>
                           <p><strong>RCCM :</strong> <span className="font-mono">{vendor.rccm || 'Non renseigné'}</span></p>
                           <p><strong>Téléphone :</strong> {vendor.phone || 'N/A'}</p>
                           <p><strong>Adresse :</strong> {vendor.address || 'N/A'}</p>
                           <p><strong>Email :</strong> {vendor.email}</p>
                         </div>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => handleUpdateUserStatus(vendor.id, 'active')} className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-colors shadow-md">
                            <CheckCircle size={20} /> Valider le compte
                          </button>
                       </div>
                    </div>
                  ))}
                  {usersList.filter(u => u.status === 'pending' && u.role === 'vendor').length === 0 && (
                    <div className="text-center py-12 text-gray-400 font-bold bg-white rounded-3xl border border-dashed border-gray-300">Aucun vendeur en attente.</div>
                  )}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* CRÉATION MANUELLE */}
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-6"><UserPlus className="text-[#1A2CB5]"/> Création Rapide d'Utilisateur</h2>
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl">
                   <p className="text-gray-500 mb-6 font-medium">Créez directement un compte utilisateur (Vendeur, Modérateur, etc.) sans qu'ils aient besoin de passer par la page d'inscription publique. Ils recevront leurs accès immédiatement et validés.</p>
                   <form onSubmit={handleCreateUser} className="space-y-4 text-sm font-bold text-gray-700">
                      <div>
                        <label className="block mb-1">Nom / Nom de l'entreprise</label>
                        <input type="text" required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5]" placeholder="Ex: Groupe Freeman SA" />
                      </div>
                      <div>
                        <label className="block mb-1">Adresse Email</label>
                        <input type="email" required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5]" placeholder="contact@entreprise.com" />
                      </div>
                      <div>
                        <label className="block mb-1">Mot de passe temporaire</label>
                        <input type="password" required value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5]" placeholder="Minimum 6 caractères" />
                      </div>
                      <div>
                        <label className="block mb-1">Rôle initial</label>
                        <select required value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#1A2CB5] focus:ring-1 focus:ring-[#1A2CB5] bg-white">
                          <option value="customer">Client (Acheteur Simple)</option>
                          <option value="vendor">Vendeur Professionnel</option>
                          {isSuperAdmin && <option value="moderator">Administrateur (Modérateur)</option>}
                          {isSuperAdmin && <option value="finance">Administrateur (Finance)</option>}
                          {isSuperAdmin && <option value="fraud">Administrateur (Fraude)</option>}
                        </select>
                      </div>

                      <button type="submit" disabled={isCreatingUser} className="w-full mt-6 bg-[#1A2CB5] text-white py-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4 shadow-md">
                         {isCreatingUser ? <Loader2 className="animate-spin" size={20} /> : <><UserPlus size={20} /> Créer & Valider</>}
                      </button>
                   </form>
                </div>
              </div>

            </div>
         )}

      </div>
    </div>
  );
}
