import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDoc, doc } from 'firebase/firestore';
import { useSearchParams, useNavigate } from 'react-router';
import { Search, Send, User, ChevronLeft, Loader2, ArrowLeft, MessageSquare, Package } from 'lucide-react';
import { Link } from 'react-router';
export function MessagesPage({ embedded = false }: { embedded?: boolean }) {
  const { user, userData } = useAuth();
  const [searchParams] = useSearchParams();
  const toId = searchParams.get('to');
  const productId = searchParams.get('product');
  const orderId = searchParams.get('order');
  const isRfq = searchParams.get('rfq') === 'true';
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // État pour le produit contextuel
  const [contextProduct, setContextProduct] = useState<any>(null);

  // État pour la commande contextuelle
  const [contextOrder, setContextOrder] = useState<any>(null);

  useEffect(() => {
    if (productId) {
      getDoc(doc(db, 'products', productId)).then((snap: any) => {
        if (snap.exists()) setContextProduct({ id: snap.id, ...snap.data() });
      });
    }
  }, [productId]);

  useEffect(() => {
    if (orderId) {
      getDoc(doc(db, 'orders', orderId)).then((snap: any) => {
        if (snap.exists()) setContextOrder({ id: snap.id, ...snap.data() });
      });
    }
  }, [orderId]);

  useEffect(() => {
    if (isRfq && contextProduct && !activeConv) {
      setInputMessage(`Bonjour, je souhaiterais obtenir un devis personnalisé pour le produit "${contextProduct.title}". Quels seraient vos tarifs dégressifs pour une commande en gros ?`);
    }
  }, [isRfq, contextProduct, activeConv]);

  // Sécurité Auth
  useEffect(() => {
    if (user === null) navigate('/connexion');
  }, [user, navigate]);

  // Récupération des Conversations
  useEffect(() => {
    if (!user) return;
    
    // On récupère les conversations où je suis acheteur OU vendeur
    const qCustomer = query(collection(db, 'conversations'), where('customerId', '==', user.uid));
    const qVendor = query(collection(db, 'conversations'), where('vendorId', '==', user.uid));
    
    const unsubscribeCustomer = onSnapshot(qCustomer, (snap) => {
      const custConvs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(prev => {
        const merged = [...prev.filter(c => c.customerId !== user.uid), ...custConvs];
        return merged.sort((a,b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis());
      });
      setLoadingConv(false);
    });

    const unsubscribeVendor = onSnapshot(qVendor, (snap) => {
      const vendConvs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConversations(prev => {
        const merged = [...prev.filter(c => c.vendorId !== user.uid), ...vendConvs];
        return merged.sort((a,b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis());
      });
      setLoadingConv(false);
    });

    return () => { unsubscribeCustomer(); unsubscribeVendor(); };
  }, [user]);

  // Forcer l'ouverture / Création d'une convo si on vient d'un produit
  useEffect(() => {
    async function initProductConversation() {
      if (!user || !toId || !productId || conversations.length === 0 && loadingConv) return;
      
      const existing = conversations.find(c => 
        (c.vendorId === toId && c.customerId === user.uid && c.productId === productId)
      );

      if (existing) {
        setActiveConv(existing);
      } else {
        // C'est potentiellement une nouvelle, mais la logique AddDoc sera faite au 1er message
        setActiveConv({
          isNew: true,
          vendorId: toId,
          customerId: user.uid,
          productId: productId || null,
          orderId: orderId || null,
          customerName: userData?.name || user.email,
          title: orderId ? `Commande: CMD-${orderId.substring(0,6).toUpperCase()}` : (contextProduct ? (isRfq ? `Devis: ${contextProduct.title}` : `Question: ${contextProduct.title}`) : "Nouvelle Requête B2B...")
        });
      }
    }
    initProductConversation();
  }, [toId, productId, user, loadingConv, conversations]);

  // Récupération des messages si la conversation est active
  useEffect(() => {
    if (!activeConv || activeConv.isNew) {
      setMessages([]);
      return;
    }

    const qMsg = query(collection(db, 'conversations', activeConv.id, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribeMsg = onSnapshot(qMsg, (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      // Scroll to bottom
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribeMsg();
  }, [activeConv]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !user || !activeConv) return;
    
    const msgText = inputMessage.trim();
    setInputMessage('');

    try {
      let currentConvId = activeConv.id;
      
      // Si la conv n'existe pas encore en BDD, on la crée
      if (activeConv.isNew) {
        const newConv = await addDoc(collection(db, 'conversations'), {
          vendorId: activeConv.vendorId,
          customerId: activeConv.customerId,
          productId: activeConv.productId,
          customerName: activeConv.customerName,
          title: activeConv.title,
          updatedAt: serverTimestamp()
        });
        currentConvId = newConv.id;
        setActiveConv({ ...activeConv, id: currentConvId, isNew: false });
      }

      await addDoc(collection(db, 'conversations', currentConvId, 'messages'), {
        senderId: user.uid,
        text: msgText,
        timestamp: serverTimestamp()
      });

    } catch(e) {
      console.error(e);
    }
  };

  if (!user) return null;

  const chatContent = (
    <div className={`flex-1 flex overflow-hidden ${embedded ? 'rounded-3xl border border-gray-100' : ''}`}>
      {/* SIDEBAR : Liste des conversations */}
      <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Rechercher..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#1A2CB5] text-sm font-medium" />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loadingConv ? (
             <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
          ) : conversations.length === 0 && !activeConv?.isNew ? (
             <div className="text-center py-10 text-gray-400 font-medium text-sm">Aucune discussion</div>
          ) : (
             <div className="divide-y divide-gray-100">
               {activeConv?.isNew && (
                 <div className="p-4 border-l-4 border-[#1A2CB5] bg-blue-50 cursor-pointer">
                   <div className="font-bold text-gray-900 text-sm">Nouvelle discussion</div>
                   <div className="text-xs text-[#1A2CB5] mt-1 font-medium">Brouillon B2B</div>
                 </div>
               )}
               {conversations.map(conv => {
                 const isMeCustomer = conv.customerId === user.uid;
                 const partnerName = isMeCustomer ? "Vendeur Partenaire" : conv.customerName;

                 return (
                   <div 
                     key={conv.id} 
                     onClick={() => setActiveConv(conv)}
                     className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${activeConv?.id === conv.id ? 'border-[#1A2CB5] bg-blue-50/50' : 'border-transparent'}`}
                   >
                     <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0 border border-gray-200">
                       <User size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{partnerName}</h4>
                       </div>
                       <p className="text-xs text-gray-500 truncate font-medium">{conv.title}</p>
                     </div>
                   </div>
                 );
               })}
             </div>
          )}
        </div>
      </div>

      {/* MAIN AREA : Fenêtre de discussion */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-[#e5ddd5] relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/az-subtle.png")'}}></div>
          
          <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-4 z-10 shadow-sm flex-shrink-0">
             <button className="md:hidden text-gray-500" onClick={() => setActiveConv(null)}>
               <ChevronLeft size={24} />
             </button>
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                <User size={18} />
             </div>
             <div>
                <h3 className="font-bold text-gray-900">
                  {activeConv.isNew ? 'Nouveau Vendeur' : (activeConv.customerId === user.uid ? 'Vendeur Pro' : activeConv.customerName)}
                </h3>
                <p className="text-xs text-gray-500">Sujet de discussion : <span className="font-bold text-[#1A2CB5]">{activeConv.title}</span></p>
             </div>
          </div>

          {contextProduct && (
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 border-b border-gray-100 flex items-center justify-between z-10 animate-in slide-in-from-top-2">
               <div className="flex items-center gap-3">
                 <img src={contextProduct.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-100 shadow-sm" />
                 <div className="min-w-0">
                    <p className="text-[10px] font-black text-[#1A2CB5] uppercase tracking-widest">{isRfq ? '💼 Demande de Devis' : '🛒 Demande d\'info'}</p>
                    <h4 className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{contextProduct.title}</h4>
                 </div>
               </div>
               <Link to={`/boutique/${contextProduct.id}`} className="text-[10px] font-black bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all uppercase">
                 Voir Fiche
               </Link>
            </div>
          )}
          {contextOrder && (
            <div className="bg-white/80 backdrop-blur-md px-4 py-2 border-b border-gray-100 flex items-center justify-between z-10 animate-in slide-in-from-top-2">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center border border-orange-200">
                    <Package size={20}/>
                 </div>
                 <div className="min-w-0">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">📦 Suivi Commande</p>
                    <h4 className="text-xs font-bold text-gray-900 truncate">CMD-{contextOrder.id.substring(0,6).toUpperCase()} - {contextOrder.totalAmount.toLocaleString()} FCFA</h4>
                 </div>
               </div>
               <Link to={userData?.role === 'vendor' ? '/vendeur/dashboard' : '/client/dashboard'} className="text-[10px] font-black bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all uppercase">
                 Voir Suivi
               </Link>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-4 z-10 flex flex-col space-y-3">
             <div className="bg-[#1A2CB5]/10 text-center py-2 px-4 rounded-xl mx-auto w-fit text-xs font-bold text-[#1A2CB5] shadow-sm tracking-wide">
               Les conversations sont cryptées de bout en bout par Freeman Group.
             </div>
             {messages.map((msg, idx) => {
               const isMine = msg.senderId === user.uid;
               return (
                 <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] md:max-w-[60%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMine ? 'bg-[#1A2CB5] text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm'}`}>
                     {msg.text}
                     <div className={`text-[9px] text-right mt-1 opacity-70 ${isMine ? 'text-blue-100' : 'text-gray-400'}`}>
                       Aujourd'hui
                     </div>
                   </div>
                 </div>
               );
             })}
             <div ref={messagesEndRef} />
          </div>
          <div className="bg-[#f0f2f5] p-3 md:p-4 z-10 flex-shrink-0">
             <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Écrivez un message..." 
                  className="flex-1 px-5 py-3.5 bg-white border-none rounded-full outline-none focus:ring-2 focus:ring-[#1A2CB5]/20 font-medium text-sm shadow-sm"
                />
                <button type="submit" disabled={!inputMessage.trim()} className="w-12 h-12 bg-[#1A2CB5] text-white rounded-full flex items-center justify-center hover:bg-black transition-colors disabled:opacity-50 shadow-sm flex-shrink-0">
                  <Send size={18} className="translate-x-0.5" />
                </button>
             </form>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#f8f9fa] border-l border-gray-200">
           <div className="text-center">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
               <MessageSquare size={32} className="text-[#1A2CB5]" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Messagerie Privée</h3>
             <p className="text-gray-500 max-w-sm">Sélectionnez une conversation sur la gauche ou contactez un vendeur depuis une fiche produit pour démarrer une discussion.</p>
           </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div className="h-[75vh] flex overflow-hidden">{chatContent}</div>;
  }

  return (
    <div className="w-full bg-[#f8f9fa] h-screen flex flex-col font-sans">
      <div className="bg-[#1A2CB5] text-white px-4 py-3 flex items-center justify-between shadow-md z-10 flex-shrink-0">
         <Link to={userData?.role === 'vendor' ? '/vendeur/dashboard' : '/boutique'} className="flex items-center gap-2 font-bold hover:text-blue-200 transition-colors">
            <ArrowLeft size={18} /> {userData?.role === 'vendor' ? 'Retour Dashboard Vendeur' : 'Retour Boutique'}
         </Link>
         <div className="font-bold tracking-widest text-sm opacity-80 flex items-center gap-2">
            <MessageSquare size={16} /> MESSAGERIE FREEMAN
         </div>
      </div>
      {chatContent}
    </div>
  );
}
