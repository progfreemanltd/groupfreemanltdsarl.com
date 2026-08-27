import { Outlet, Link, useSearchParams, useLocation } from 'react-router';
import { Toaster, toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import { CurrencyProvider, useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { MARKETPLACE_CATEGORIES } from '../data/marketplaceCategories';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, Globe, MapPin, Bell, MessageCircle, User, Grid, ChevronRight, PlusSquare, ShieldAlert, WifiOff, Package } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Header() {
  const { userData } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const menuRef = useRef<HTMLDivElement>(null);
  const { country, currency, setCurrency } = useCurrency();
  const { items } = useCart();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/client') || 
                      location.pathname.startsWith('/vendeur') || 
                      location.pathname.startsWith('/admin');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // Offline Listeners pour la PWA
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 3. Notifications Messagerie
    let unsubMsgs = () => {};
    if (user) {
      // Pour faire simple, on compte les conversations actives non lues par l'utilisateur
      // Dans une prod réelle, on ferait une collection 'unread' par user
      const q = query(collection(db, 'conversations'), where('updatedAt', '!=', null));
      unsubMsgs = onSnapshot(q, (snap: any) => {
        // Logique simplifiée pour la démo: simule 1-3 notifications si des conv existents
        setUnreadMessages(snap.docs.length > 0 ? snap.docs.length % 4 : 0);
      });
    }

    // 4. Notifications Commandes
    let unsubOrders = () => {};
    if (user) {
      const q = query(collection(db, 'orders'), where('buyerId', '==', user.uid), where('status', '==', 'delivered_by_vendor'));
      unsubOrders = onSnapshot(q, (snap: any) => setPendingOrders(snap.docs.length));
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubMsgs();
      unsubOrders();
    };
  }, [user]);

  const activeCategoryData = MARKETPLACE_CATEGORIES.find(c => c.id === activeMenu);

  return (
    <>
      {/* Banner Internationalisation */}
      <div className="bg-[#1A2CB5] text-white text-[11px] sm:text-xs font-bold py-2 px-4 flex flex-wrap justify-center items-center gap-2 sm:gap-4 tracking-wide w-full relative z-[60]">
        <span className="flex items-center gap-1"><MapPin size={12} className="text-[#d4af37]" /> Vous êtes connecté depuis : <span className="text-[#d4af37] font-black uppercase">{country}</span></span>
        <span className="hidden sm:inline opacity-30">|</span>
        <span>Plateforme B2B Exclusive Afrique</span>
      </div>

      {isOffline && (
        <div className="bg-orange-500 text-white text-xs sm:text-sm font-bold py-3 px-4 flex justify-center items-center gap-2 w-full relative z-[60] animate-in slide-in-from-top-2">
           <WifiOff size={16} /> Mode Hors-Ligne : Vous naviguez actuellement sans connexion internet.
        </div>
      )}

      {/* Header Marketplace */}
      <div ref={menuRef} onMouseLeave={() => setActiveMenu(null)} className="bg-white border-b border-gray-200 pt-4 shadow-sm z-40 relative transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Ligne Principale */}
          <div onMouseEnter={() => setActiveMenu(null)} className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
            
            {/* Bloc Gauche */}
            <div className="flex items-center gap-6 w-full lg:w-auto flex-shrink-0">
              <div className="flex items-center gap-4">
                <Link to="/" className="group flex-shrink-0" title="Retour au site Corporate">
                  <img src="/logo.png" alt="Freeman Group" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </Link>
                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                <Link to="/boutique" className="flex flex-col group" title="Accueil Freeman Market">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-[#1A2CB5] transition-colors">B2B</span>
                  <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none group-hover:text-[#1A2CB5] transition-colors">Freeman <span className="text-[#1A2CB5]">Market</span></span>
                </Link>
              </div>
              
                {userData?.role === 'vendor' ? (
                  <Link to="/vendeur/nouvelle-annonce" className="hidden sm:flex items-center gap-2 bg-[#1A2CB5] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-sm">
                    <PlusSquare size={18} />
                    <span>Déposer une annonce</span>
                  </Link>
                ) : (
                  <Link to="/client/dashboard?tab=alerts" className="hidden sm:flex items-center gap-2 bg-[#1A2CB5] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-colors shadow-sm">
                    <Bell size={18} />
                    <span>Créer une alerte</span>
                  </Link>
                )}
            </div>

            {/* Barre de recherche */}
            <div className="flex-grow w-full max-w-3xl flex">
              <input 
                type="text" 
                placeholder="Rechercher des équipements, logiciels, services pro..." 
                className="w-full px-5 py-3 bg-gray-100 border-none rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#1A2CB5]/50 text-sm placeholder-gray-500 font-medium"
              />
              <button onClick={() => toast("La recherche sémantique est en cours d'intégration.")} className="bg-[#1A2CB5] px-6 text-white rounded-r-xl hover:bg-black transition-colors flex items-center justify-center flex-shrink-0 shadow-sm">
                <Search size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bloc Droit */}
            <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
              <div className="flex flex-col items-center justify-center relative group z-50 text-gray-700 hover:text-[#1A2CB5]">
                <Globe size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] font-medium mt-1 uppercase">XOF</span>
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              <Link to="/boutique" className="flex flex-col items-center justify-center text-gray-700 hover:text-[#1A2CB5] group">
                <Bell size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] font-medium mt-1">Boutique</span>
              </Link>
              <Link to="/panier" className="flex flex-col items-center justify-center text-gray-700 hover:text-[#1A2CB5] group relative">
                <ShoppingCart size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] font-medium mt-1">Panier</span>
                {items.length > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{items.length}</span>}
              </Link>
              <Link to={userData?.role === 'vendor' ? "/messages" : "/client/dashboard?tab=messages"} className="flex flex-col items-center justify-center text-gray-700 hover:text-[#1A2CB5] group relative">
                <MessageCircle size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] font-medium mt-1">Messages</span>
                {unreadMessages > 0 && <span className="absolute -top-1 -right-1 bg-[#1A2CB5] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{unreadMessages}</span>}
              </Link>

              <Link to={userData?.role === 'vendor' ? "/vendeur/dashboard?tab=analytics" : "/client/dashboard?tab=orders"} className="flex flex-col items-center justify-center text-gray-700 hover:text-[#1A2CB5] group relative">
                <Package size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                <span className="text-[11px] font-medium mt-1">Commandes</span>
                {pendingOrders > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">{pendingOrders}</span>}
              </Link>
              
              {/* LIEN ADMIN SI LE USER A LE ROLE */}
              {userData && ['super_admin', 'moderator', 'finance', 'fraud'].includes(userData.role || '') && (
                <Link to="/admin/dashboard" className="flex flex-col items-center justify-center text-red-600 hover:text-red-800 group relative">
                  <ShieldAlert size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[11px] font-bold mt-1">Admin</span>
                </Link>
              )}

              <Link to={userData?.role === 'vendor' ? '/vendeur/dashboard?tab=settings' : '/client/dashboard?tab=profile'} className="flex flex-col items-center justify-center text-gray-700 hover:text-[#1A2CB5] group">
                <div className="relative">
                  <User size={22} strokeWidth={1.5} className="group-hover:-translate-y-1 transition-transform" />
                  {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></span>}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-medium mt-1">Mon Espace</span>
                  {userData && userData.name && (
                    <span className="text-[9px] font-bold text-[#1A2CB5] truncate max-w-[80px]" title={userData.name}>
                      {userData.name.split(' ')[0]} ({userData.role === 'vendor' ? 'Pro' : 'Client'})
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* Ligne Secondaire : Catégories - MASQUÉE DANS LE DASHBOARD */}
          {!isDashboard && (
            <div className="flex flex-wrap items-center justify-center gap-x-2 mt-6 font-medium text-gray-600 overflow-x-auto scrollbar-none">
              {MARKETPLACE_CATEGORIES.map((cat, i) => (
                <div key={cat.id} className="flex items-center">
                  <Link 
                    to={`/boutique?cat=${cat.id}`}
                    onClick={() => setActiveMenu(null)}
                    onMouseEnter={() => setActiveMenu(cat.id)}
                    className={`block hover:text-[#1A2CB5] whitespace-nowrap text-[13px] transition-colors pb-3 border-b-2 outline-none cursor-pointer ${activeMenu === cat.id ? 'border-[#1A2CB5] text-[#1A2CB5] font-bold' : 'border-transparent'} ${cat.isHighlight && activeMenu !== cat.id ? 'text-[#1A2CB5] font-bold' : ''}`}>
                    {cat.name}
                  </Link>
                  {i < MARKETPLACE_CATEGORIES.length - 1 && <span className="mx-3 text-gray-300 font-bold pb-3 flex-shrink-0">·</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mega Menu Dropdown - MASQUÉ DANS LE DASHBOARD */}
        {!isDashboard && activeCategoryData && (
          <div className="absolute top-full left-0 w-full bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] border-t border-gray-100 flex z-50 overflow-hidden" style={{ minHeight: '400px', maxHeight: '70vh' }}>
            <div className="max-w-7xl mx-auto w-full flex h-full">
              <div className="w-[280px] flex-shrink-0 bg-[#f4f6f8] p-8 flex flex-col h-full border-r border-[#eaecf0]">
                <h2 className="font-bold text-gray-900 border-l-[3px] pl-3 border-[#1A2CB5] text-lg mb-6 flex items-center gap-2">
                  <Grid size={18} className="text-[#1A2CB5]" /> {activeCategoryData.name}
                </h2>
                
                <div className="mt-auto bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#1A2CB5] hover:shadow-md transition-all group">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">Explorer tout</div>
                    <div className="text-sm font-bold text-[#1A2CB5] group-hover:text-black transition-colors">Voir les {Math.floor(Math.random() * 50) + 10} produits</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-3 gap-x-12 gap-y-8">
                  {activeCategoryData.subcategories?.map(subGroup => (
                    <div key={subGroup.id}>
                      <h3 className="font-black text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 inline-block text-sm">{subGroup.name}</h3>
                      <ul className="space-y-3">
                        {subGroup.items && subGroup.items.map(item => (
                          <li key={item.id}>
                            <Link to={`/boutique?cat=${item.id}`} onClick={() => setActiveMenu(null)} className="text-gray-500 hover:text-[#1A2CB5] text-[13px] font-medium transition-colors hover:pl-1 block flex items-center gap-2">
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#1A2CB5] mb-1">Besoin d'un produit spécifique ?</h4>
                    <p className="text-sm text-gray-600">Publiez un appel d'offre B2B pour cette catégorie.</p>
                  </div>
                  <button onClick={() => toast("Les appels d'offres seront bientôt disponibles.")} className="bg-white text-[#1A2CB5] px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-black hover:text-white transition-all">Publier une demande</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function MarketplaceLayout() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-white text-black font-sans relative flex flex-col">
        {/* Le Header global injecté ici */}
        <Header />
        
        <main className="flex-1 w-full bg-[#f8f9fa] relative z-10 flex flex-col">
          <Outlet />
        </main>
        <Toaster position="top-right" theme="light" />
      </div>
    </CurrencyProvider>
  );
}
