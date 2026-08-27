import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Printer, Download, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Globe, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const snap = await getDoc(doc(db, 'orders', id));
        if (snap.exists()) {
          setOrder({ id: snap.id, ...snap.data() });
        } else {
          toast.error("Facture introuvable.");
          navigate('/client/commandes');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#1A2CB5]" size={48}/></div>;
  if (!order) return null;

  const dateStr = order.createdAt?.toMillis ? new Date(order.createdAt.toMillis()).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Date inconnue';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">
        
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-8 print:hidden">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black font-bold">
             <ArrowLeft size={20} /> Retour
           </button>
           <div className="flex gap-4">
              <button 
                onClick={handlePrint}
                className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Printer size={18} /> Imprimer
              </button>
              <button 
                onClick={() => toast.info("Téléchargement PDF en cours de génération...")}
                className="bg-[#1A2CB5] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors shadow-lg"
              >
                <Download size={18} /> Télécharger PDF
              </button>
           </div>
        </div>

        {/* Facture Layout */}
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none">
           
           {/* Header */}
           <div className="bg-[#1A2CB5] p-12 text-white flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                 <img src="/logo.png" alt="Freeman Group" className="h-12 brightness-0 invert opacity-90 mb-6" />
                 <h1 className="text-4xl font-black mb-2">FACTURE</h1>
                 <p className="text-blue-100 font-bold opacity-80 uppercase tracking-widest text-sm">Réf: INV-{order.id.toUpperCase()}</p>
              </div>
              <div className="text-right md:text-left space-y-2 opacity-90">
                 <div className="flex items-center gap-2 md:justify-end"><Globe size={14}/> <span>freeman-group.com</span></div>
                 <div className="flex items-center gap-2 md:justify-end"><Phone size={14}/> <span>+229 90 00 00 00</span></div>
                 <div className="flex items-center gap-2 md:justify-end"><Mail size={14}/> <span>b2b@freeman-group.com</span></div>
                 <div className="flex items-center gap-2 md:justify-end"><MapPin size={14}/> <span>Cotonou, Bénin</span></div>
              </div>
           </div>

           <div className="p-12">
              {/* Infos Client & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                 <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Destinataire</h3>
                    <div className="space-y-1">
                       <p className="font-black text-xl text-gray-900">Acheteur #{order.buyerId.substring(0,8)}</p>
                       <p className="text-gray-500 font-medium">Bénéficiaire Marketplace B2B</p>
                       <p className="text-gray-500 font-medium">ID Transaction : {order.id}</p>
                    </div>
                 </div>
                 <div className="md:text-right">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Détails Facturation</h3>
                    <div className="space-y-1">
                       <p className="text-gray-900 font-bold">Date de facturation</p>
                       <p className="text-[#1A2CB5] font-black text-lg">{dateStr}</p>
                       <p className="text-gray-500 font-medium mt-4">Statut Paiement</p>
                       <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Sécurisé & Confirmé</span>
                    </div>
                 </div>
              </div>

              {/* Table articles */}
              <div className="mb-12">
                 <table className="w-full text-left">
                    <thead className="bg-gray-50 border-y border-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest text-sm">
                       <tr>
                          <th className="p-4">Désignation</th>
                          <th className="p-4 text-center">Quantité</th>
                          <th className="p-4 text-right">Prix Unitaire HT</th>
                          <th className="p-4 text-right">TVA (18%)</th>
                          <th className="p-4 text-right">Total TTC</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {order.items.map((item: any, idx: number) => {
                          const itemTotalHt = item.priceValue * item.quantity;
                          const itemVat = item.isVatApplied ? itemTotalHt * 0.18 : 0;
                          return (
                             <tr key={idx} className="text-sm">
                                <td className="p-4">
                                   <div className="font-bold text-gray-900">{item.title}</div>
                                   <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">REF: {item.id.substring(0,6)}</div>
                                </td>
                                <td className="p-4 text-center font-bold text-gray-700">x {item.quantity}</td>
                                <td className="p-4 text-right font-medium text-gray-600">{item.priceValue.toLocaleString()} FCFA</td>
                                <td className="p-4 text-right font-medium text-gray-600">{itemVat > 0 ? `${itemVat.toLocaleString()} FCFA` : 'Exonéré'}</td>
                                <td className="p-4 text-right font-black text-gray-900">{(itemTotalHt + itemVat).toLocaleString()} FCFA</td>
                             </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>

              {/* Totaux Final */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-8 border-t-2 border-gray-50">
                 <div className="max-w-xs">
                    <div className="flex items-center gap-2 mb-4">
                       <ShieldCheck className="text-green-500" />
                       <h4 className="font-bold text-gray-900">Garantie Freeman Group</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                       Cette facture est générée par la plateforme Freeman B2B Marketplace. Les fonds ont été sécurisés via notre système de séquestre (Escrow) pour garantir la satisfaction des deux parties.
                    </p>
                 </div>
                 <div className="w-full md:w-80 space-y-4">
                    <div className="flex justify-between text-gray-500 font-bold">
                       <span>SOUS-TOTAL HT</span>
                       <span>{(order.subtotalHt || order.totalAmount).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-gray-500 font-bold">
                       <span>TVA BÉNIN (18%)</span>
                       <span>{order.totalVat?.toLocaleString() || '0'} FCFA</span>
                    </div>
                    <div className="flex justify-between items-end pt-6 border-t-2 border-gray-100">
                       <span className="font-black text-gray-900 uppercase tracking-widest text-xs">TOTAL NET À PAYER</span>
                       <span className="text-3xl font-black text-[#1A2CB5]">{order.totalAmount.toLocaleString()} FCFA</span>
                    </div>
                 </div>
              </div>

              {/* Signature & Cachet */}
              <div className="mt-20 flex justify-between items-end">
                 <div className="text-center opacity-30 grayscale saturate-0">
                    <img src="https://upload.wikimedia.org/wikipedia/fr/0/0e/Sceau_du_B%C3%A9nin.png" alt="Sceau" className="w-20 h-20 mx-auto mb-2" />
                    <p className="text-[8px] font-black uppercase">Certifié Conforme</p>
                 </div>
                 <div className="text-right">
                    <div className="mb-4 h-16 w-48 bg-gray-50 rounded-xl relative overflow-hidden flex items-center justify-center">
                       <CheckCircle2 size={32} className="text-[#1A2CB5] opacity-20" />
                       <span className="absolute text-[8px] font-black uppercase text-[#1A2CB5] tracking-[10px] rotate-[-10deg]">PAYÉ / VALIDÉ</span>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cachet Freeman Marketplace</p>
                 </div>
              </div>

           </div>

           <div className="bg-gray-50 p-8 text-center border-t border-gray-100 text-[10px] text-gray-400 font-medium uppercase tracking-[2px]">
              Freeman Group B2B Platform © 2026 - Tous droits réservés
           </div>
        </div>
      </div>
    </div>
  );
}
